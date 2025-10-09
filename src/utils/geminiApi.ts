interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export async function proofreadWithGemini(
  text: string,
  variant: 'US' | 'UK'
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const systemInstruction = variant === 'UK'
    ? "You are an expert UK English copyeditor. Your task is to proofread the provided text. Correct all spelling, grammar, and punctuation errors. Ensure the style is clear and professional. Return only the corrected text, with no extra commentary, notes, or explanations."
    : "You are an expert US English copyeditor. Your task is to proofread the provided text. Correct all spelling, grammar, and punctuation errors. Ensure the style is clear and professional. Return only the corrected text, with no extra commentary, notes, or explanations.";

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: text,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: systemInstruction,
            },
          ],
        },
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const proofreadText = data.candidates[0].content.parts[0].text;
    return proofreadText.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Proofreading failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during proofreading');
  }
}
