import { useState, useEffect, useCallback } from 'react';

interface UsePollinationsImageOptions {
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

interface UsePollinationsImageResult {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  generateImage: (prompt: string, options?: UsePollinationsImageOptions) => void;
}

export const usePollinationsImage = (
  initialPrompt?: string,
  options?: UsePollinationsImageOptions
): UsePollinationsImageResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback((prompt: string, opts?: UsePollinationsImageOptions) => {
    if (!prompt || prompt.trim().length === 0) {
      setError("Prompt is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mergedOptions = { ...options, ...opts };
      const {
        width = 1900,
        height = 900,
        seed,
        nologo = true,
        enhance = true
      } = mergedOptions;

      const enhancedPrompt = enhance
        ? `Create a professional, high-quality featured image. ${prompt}. The image should be suitable for a blog post header with good composition and visual appeal.`
        : prompt;

      const encodedPrompt = encodeURIComponent(enhancedPrompt);

      let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}`;

      if (seed !== undefined) {
        url += `&seed=${seed}`;
      }

      if (nologo) {
        url += '&nologo=true';
      }

      setImageUrl(url);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
      setError(errorMessage);
      setIsLoading(false);
      setImageUrl(null);
    }
  }, [options]);

  useEffect(() => {
    if (initialPrompt) {
      generateImage(initialPrompt);
    }
  }, []);

  return {
    imageUrl,
    isLoading,
    error,
    generateImage
  };
};