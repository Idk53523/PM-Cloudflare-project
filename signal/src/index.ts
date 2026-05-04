import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env, FeedbackRow } from './types';
import { renderDashboard } from './ui';
export { FeedbackPipeline } from './workflow';

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

// ── Mock team ──
const TEAM = [
  { id: 'maria', name: 'Maria Santos',  role: 'Backend Engineer',    initials: 'MS', color: '#3b82f6',
    expertise: ['Workers','D1','SQL','CPU Limit','Performance','Reliability','Bug'] },
  { id: 'james', name: 'James Liu',     role: 'Developer Relations', initials: 'JL', color: '#8b5cf6',
    expertise: ['Documentation','Developer Experience','Onboarding','Discord','Forum','Migration','Static Assets'] },
  { id: 'priya', name: 'Priya Patel',   role: 'AI / ML Engineer',   initials: 'PP', color: '#10b981',
    expertise: ['Workers AI','LLM','Rate Limits','Batch Processing','AI Gateway','JSON Parsing'] },
  { id: 'tom',   name: 'Tom Eriksson',  role: 'Frontend Engineer',   initials: 'TE', color: '#f59e0b',
    expertise: ['Dashboard','Wrangler','TypeScript','Deployment','Static Assets','Environment Variables','Secrets','Pagination'] },
  { id: 'sara',  name: 'Sara Kim',      role: 'Platform Engineer',   initials: 'SK', color: '#ef4444',
    expertise: ['Workflows','KV','R2','Production Issue','Migrations','Billing','Authentication','Service Bindings','Serialization','Cold Start'] },
];

function assignMember(themes: string[], feedbackId: number): { memberId: string; reason: string } {
  const scores: Record<string, number> = {};
  TEAM.forEach(m => { scores[m.id] = 0; });

  for (const theme of themes) {
    for (const member of TEAM) {
      const hit = member.expertise.find(e =>
        e.toLowerCase() === theme.toLowerCase() ||
        theme.toLowerCase().includes(e.toLowerCase()) ||
        e.toLowerCase().includes(theme.toLowerCase())
      );
      if (hit) scores[member.id]++;
    }
  }

  const sorted = TEAM.slice().sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  const best = sorted[0];

  if ((scores[best.id] ?? 0) === 0) {
    return { memberId: TEAM[feedbackId % TEAM.length].id, reason: 'General distribution' };
  }

  const matched = themes
    .filter(t => best.expertise.some(e =>
      e.toLowerCase() === t.toLowerCase() ||
      t.toLowerCase().includes(e.toLowerCase()) ||
      e.toLowerCase().includes(t.toLowerCase())
    ))
    .slice(0, 2);

  return { memberId: best.id, reason: 'Theme match: ' + matched.join(', ') };
}

// ── Dashboard ──
app.get('/', (c) => c.html(renderDashboard()));

// ── Feedback ──
app.get('/api/feedback', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM feedback ORDER BY urgency DESC, created_at DESC'
  ).all<FeedbackRow>();
  return c.json(result.results);
});

app.post('/api/feedback', async (c) => {
  const body = await c.req.json<{ source: string; author?: string; text: string }>();
  if (!body.source || !body.text) return c.json({ error: 'source and text required' }, 400);
  const result = await c.env.DB.prepare(
    'INSERT INTO feedback (source, author, text, created_at) VALUES (?, ?, ?, ?) RETURNING id'
  ).bind(body.source, body.author ?? 'anonymous', body.text, new Date().toISOString())
    .first<{ id: number }>();
  return c.json({ id: result?.id }, 201);
});

// ── Chat: streaming Q&A grounded in D1 ──
app.post('/api/chat', async (c) => {
  const { question } = await c.req.json<{ question: string }>();
  if (!question?.trim()) return c.json({ error: 'question required' }, 400);

  const result = await c.env.DB.prepare(
    'SELECT source, author, text, sentiment, urgency, themes FROM feedback ORDER BY urgency DESC, created_at DESC LIMIT 30'
  ).all<FeedbackRow>();

  const context = result.results
    .map(f => {
      const themes: string[] = JSON.parse(f.themes ?? '[]');
      return `[${f.source}] ${f.author} | sentiment:${f.sentiment} urgency:${f.urgency}/10 themes:${themes.join(',')} | "${f.text}"`;
    })
    .join('\n');

  const messages: { role: 'system' | 'user'; content: string }[] = [
    {
      role: 'system',
      content: 'You are Signal, a PM intelligence assistant. Answer questions about product feedback concisely. Ground answers in the data. Cite sources (e.g. "[discord]") when referencing specific items. Be direct and specific — no filler.',
    },
    { role: 'user', content: `Feedback data:\n${context}\n\nQuestion: ${question}` },
  ];

  const stream = (await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages, stream: true, max_tokens: 400,
  })) as unknown as ReadableStream;

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Transfer-Encoding': 'chunked' },
  });
});

// ── Digest ──
app.post('/api/digest/run', async (c) => {
  const instance = await c.env.PIPELINE.create({});
  return c.json({ instanceId: instance.id, status: 'started' });
});

app.get('/api/digest/status/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const instance = await c.env.PIPELINE.get(id);
    const status = await instance.status();
    return c.json(status);
  } catch {
    return c.json({ error: 'instance not found' }, 404);
  }
});

app.get('/api/digest/latest', async (c) => {
  const raw = await c.env.KV.get('digest:latest');
  if (!raw) return c.json({ error: 'no digest yet' }, 404);
  return c.json(JSON.parse(raw));
});

// ── Team & Assignments ──
app.get('/api/collaborators', (c) => c.json(TEAM));

app.post('/api/assign', async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, source, author, text, themes, urgency, sentiment FROM feedback WHERE sentiment = 'negative' OR urgency >= 6 ORDER BY urgency DESC LIMIT 15"
  ).all<FeedbackRow>();

  const assignments = result.results.map(row => {
    const themes: string[] = JSON.parse(row.themes ?? '[]');
    const { memberId, reason } = assignMember(themes, row.id);
    return {
      feedbackId: row.id,
      source: row.source,
      author: row.author,
      text: row.text.length > 110 ? row.text.slice(0, 110) + '…' : row.text,
      urgency: row.urgency,
      themes,
      assignedTo: memberId,
      reason,
    };
  });

  return c.json({ assignments, team: TEAM });
});

export default app;
