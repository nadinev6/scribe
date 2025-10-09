export interface ImageReference {
  url: string;
  filename: string;
  blob: Blob | null;
}

const LLM_ICON_MAP: Record<string, string> = {
  gemini: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini-color.png',
  chatgpt: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png',
  claude: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude-color.png',
  perplexity: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/perplexity-color.png',
  mistral: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png',
  groq: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/groq.png',
  deepseek: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek-color.png',
  ollama: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/ollama.png',
  anthropic: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/anthropic.png',
};

export const extractImageUrlsFromMarkdown = (markdown: string): string[] => {
  const imageUrls: string[] = [];
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const url = match[1];
    if (url.startsWith('llm-icon://')) {
      const llmType = url.replace('llm-icon://', '');
      const realUrl = LLM_ICON_MAP[llmType];
      if (realUrl) {
        imageUrls.push(realUrl);
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      imageUrls.push(url);
    } else if (url.startsWith('data:')) {
      imageUrls.push(url);
    }
  }

  return imageUrls;
};

export const getImageExtensionFromUrl = (url: string): string => {
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/data:image\/(\w+);/);
    if (mimeMatch) {
      return mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1];
    }
    return 'png';
  }

  const urlWithoutQuery = url.split('?')[0];
  const extension = urlWithoutQuery.split('.').pop()?.toLowerCase();

  if (extension && ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
    return extension;
  }

  return 'png';
};

export const downloadImage = async (url: string): Promise<Blob | null> => {
  try {
    if (url.startsWith('data:')) {
      const response = await fetch(url);
      return await response.blob();
    }

    const response = await fetch(url, {
      mode: 'cors',
      cache: 'default'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading image:', url, error);
    return null;
  }
};

export const collectImagesFromMarkdown = async (
  markdown: string,
  featuredImage: string
): Promise<ImageReference[]> => {
  const imageUrls = extractImageUrlsFromMarkdown(markdown);

  if (featuredImage && !imageUrls.includes(featuredImage)) {
    imageUrls.unshift(featuredImage);
  }

  const uniqueUrls = Array.from(new Set(imageUrls));
  const images: ImageReference[] = [];

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const extension = getImageExtensionFromUrl(url);
    const filename = `image-${i + 1}.${extension}`;

    const blob = await downloadImage(url);

    images.push({
      url,
      filename,
      blob
    });
  }

  return images.filter(img => img.blob !== null);
};

export const replaceImageUrlsInMarkdown = (
  markdown: string,
  images: ImageReference[],
  imageFolder: string = 'images'
): string => {
  let updatedMarkdown = markdown;

  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = Array.from(markdown.matchAll(imageRegex));

  matches.forEach(match => {
    const fullMatch = match[0];
    const altText = match[1];
    let originalUrl = match[2];

    if (originalUrl.startsWith('llm-icon://')) {
      const llmType = originalUrl.replace('llm-icon://', '');
      originalUrl = LLM_ICON_MAP[llmType] || originalUrl;
    }

    const imageRef = images.find(img => img.url === originalUrl);

    if (imageRef) {
      const newImageRef = `![${altText}](${imageFolder}/${imageRef.filename})`;
      updatedMarkdown = updatedMarkdown.replace(fullMatch, newImageRef);
    }
  });

  return updatedMarkdown;
};
