export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  AI: Ai;
  PIPELINE: Workflow;
};

export type FeedbackRow = {
  id: number;
  source: string;
  author: string;
  text: string;
  created_at: string;
  sentiment: string | null;
  urgency: number | null;
  themes: string | null;
  processed: number;
};

export type DigestPayload = {
  generatedAt: string;
  totalItems: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  avgUrgency: number;
  topThemes: { name: string; count: number }[];
  narrative: string;
};
