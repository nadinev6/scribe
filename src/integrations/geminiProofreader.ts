export type ProofreadOptions = {
  language?: 'en' | 'zh-CN' | 'zh-TW' | string;
  features?: { spell?: boolean; grammar?: boolean; style?: boolean };
  model?: string;
};

export type ProofreadResponse = {
  original: string;
  corrected: string;
  suggestions?: Array<{
    range: [number, number];
    suggestion: string;
    explanation?: string;
  }>;
};

export async function proofreadWithGemini(
  input: string,
  opts: ProofreadOptions = {}
): Promise<ProofreadResponse> {
  // Support multiple environments: Vite's import.meta.env, Node's process.env, or a global var
  const metaEnv = typeof (import.meta as any) !== 'undefined' ? (import.meta as any).env : undefined;
  const nodeEnv = typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env : undefined;
  const API_URL = metaEnv?.VITE_GEMINI_API_URL || nodeEnv?.VITE_GEMINI_API_URL || (globalThis as any).VITE_GEMINI_API_URL;
  const API_KEY = metaEnv?.VITE_GEMINI_API_KEY || nodeEnv?.VITE_GEMINI_API_KEY || (globalThis as any).VITE_GEMINI_API_KEY;

  if (!API_URL) {
    throw new Error('VITE_GEMINI_API_URL is not set');
  }

  const payload = {
    model: opts.model ?? 'gemini-2.0-flash',
    language: opts.language ?? 'en',
    input,
    features: opts.features ?? { spell: true, grammar: true, style: true },
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Proofreader API error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as ProofreadResponse;
  return json;
}
