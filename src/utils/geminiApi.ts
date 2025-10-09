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
  variant: 'US' | 'UK' | 'zh-CN' | 'zh-TW'
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  let systemInstruction = '';

  switch (variant) {
    case 'UK':
      systemInstruction = "You are an expert UK English copyeditor. Your task is to proofread the provided text. Correct all spelling, grammar, and punctuation errors. Ensure the style is clear and professional. Return only the corrected text, with no extra commentary, notes, or explanations.";
      break;
    case 'zh-CN':
      systemInstruction = "你是一位专业的简体中文技术文档编辑。你的任务是校对提供的文本。纠正所有拼写、语法和标点符号错误。确保文风清晰、专业、符合技术写作规范。支持中英文混合内容，保持专业术语的准确性。只返回修正后的文本，不要添加任何额外的评论、注释或解释。";
      break;
    case 'zh-TW':
      systemInstruction = "你是一位專業的繁體中文技術文檔編輯。你的任務是校對提供的文本。糾正所有拼寫、語法和標點符號錯誤。確保文風清晰、專業、符合技術寫作規範。支持中英文混合內容，保持專業術語的準確性。只返回修正後的文本，不要添加任何額外的評論、註釋或解釋。";
      break;
    case 'US':
    default:
      systemInstruction = "You are an expert US English copyeditor. Your task is to proofread the provided text. Correct all spelling, grammar, and punctuation errors. Ensure the style is clear and professional. Return only the corrected text, with no extra commentary, notes, or explanations.";
      break;
  }

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
