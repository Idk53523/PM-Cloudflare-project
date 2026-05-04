import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { Env, FeedbackRow, DigestPayload } from './types';

type Params = Record<string, never>;

export class FeedbackPipeline extends WorkflowEntrypoint<Env, Params> {
  async run(_event: WorkflowEvent<Params>, step: WorkflowStep) {
    // Step 1: Fetch unprocessed feedback
    const unprocessed = await step.do('fetch-unprocessed', async () => {
      const result = await this.env.DB.prepare(
        'SELECT * FROM feedback WHERE processed = 0 ORDER BY created_at DESC LIMIT 20'
      ).all<FeedbackRow>();
      return result.results;
    });

    if (unprocessed.length === 0) {
      // Nothing to process — skip to digest generation
    } else {
      // Step 2: Analyze each item with Workers AI
      const analyzed = await step.do('analyze-feedback', async () => {
        const results: { id: number; sentiment: string; urgency: number; themes: string[] }[] = [];

        for (const item of unprocessed) {
          try {
            const prompt = `Analyze this product feedback. Reply with ONLY this exact format on one line:
SENTIMENT:positive|negative|neutral URGENCY:1-10 THEMES:theme1,theme2,theme3

Feedback: "${item.text.replace(/"/g, "'")}"`;

            const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 80,
            }) as { response?: string };

            const text = response?.response ?? '';
            const sentiment = text.match(/SENTIMENT:(positive|negative|neutral)/i)?.[1]?.toLowerCase() ?? 'neutral';
            const urgency = parseInt(text.match(/URGENCY:(\d+)/i)?.[1] ?? '5', 10);
            const themesRaw = text.match(/THEMES:([^\n]+)/i)?.[1] ?? 'General';
            const themes = themesRaw.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3);

            results.push({ id: item.id, sentiment, urgency: Math.min(10, Math.max(1, urgency)), themes });
          } catch {
            results.push({ id: item.id, sentiment: 'neutral', urgency: 5, themes: ['General'] });
          }
        }
        return results;
      });

      // Step 3: Write analysis results back to D1
      await step.do('update-database', async () => {
        for (const item of analyzed) {
          await this.env.DB.prepare(
            'UPDATE feedback SET sentiment = ?, urgency = ?, themes = ?, processed = 1 WHERE id = ?'
          )
            .bind(item.sentiment, item.urgency, JSON.stringify(item.themes), item.id)
            .run();
        }
        return { updated: analyzed.length };
      });
    }

    // Step 4: Generate digest from all processed feedback and cache in KV
    await step.do('generate-digest', async () => {
      const all = await this.env.DB.prepare(
        'SELECT * FROM feedback WHERE processed = 1 ORDER BY created_at DESC'
      ).all<FeedbackRow>();

      const rows = all.results;

      // Compute stats from data (reliable — no AI needed)
      const breakdown = { positive: 0, neutral: 0, negative: 0 };
      let urgencySum = 0;
      const themeCounts: Record<string, number> = {};

      for (const row of rows) {
        const s = row.sentiment as keyof typeof breakdown;
        if (s in breakdown) breakdown[s]++;
        urgencySum += row.urgency ?? 5;

        const themes: string[] = JSON.parse(row.themes ?? '[]');
        for (const t of themes) {
          themeCounts[t] = (themeCounts[t] ?? 0) + 1;
        }
      }

      const topThemes = Object.entries(themeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

      // Ask AI for a narrative summary (plain text — no JSON parsing needed)
      const snippets = rows
        .filter((r) => r.sentiment === 'negative' && (r.urgency ?? 0) >= 7)
        .slice(0, 5)
        .map((r) => `[${r.source}] ${r.text.slice(0, 120)}`)
        .join('\n');

      const narrativePrompt = `You are a PM assistant summarizing product feedback. Write 3 concise sentences for a weekly digest. Focus on the most urgent negative patterns. Here are the top urgent issues:\n\n${snippets}`;

      const narrativeRes = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: narrativePrompt }],
        max_tokens: 200,
      }) as { response?: string };

      const digest: DigestPayload = {
        generatedAt: new Date().toISOString(),
        totalItems: rows.length,
        sentimentBreakdown: breakdown,
        avgUrgency: rows.length ? Math.round((urgencySum / rows.length) * 10) / 10 : 0,
        topThemes,
        narrative: narrativeRes?.response?.trim() ?? 'No narrative generated.',
      };

      await this.env.KV.put('digest:latest', JSON.stringify(digest), { expirationTtl: 3600 });
      return { ok: true };
    });
  }
}
