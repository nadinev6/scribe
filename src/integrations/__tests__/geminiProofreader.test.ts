import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { proofreadWithGemini, ProofreadResponse } from '../geminiProofreader';

describe('proofreadWithGemini', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as any).VITE_GEMINI_API_URL;
    delete (globalThis as any).fetch;
  });

  it('sends a request and returns parsed response', async () => {
    const mockResponse: ProofreadResponse = {
      original: '这是一个错别字',
      corrected: '这是一个错别字',
      suggestions: [],
    };

    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
    );

    (globalThis as any).fetch = fetchMock;
    (globalThis as any).VITE_GEMINI_API_URL = 'https://example.com/proofread';

    const result = await proofreadWithGemini('测试文本', { language: 'zh-CN' });

    expect(fetchMock).toHaveBeenCalled();
    expect(result).toHaveProperty('original');
    expect(result).toHaveProperty('corrected');
  });
});
