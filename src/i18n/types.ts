export interface Translations {
  app: {
    title: string;
  };
  tabs: {
    uploadImage: string;
    generateWithAI: string;
    richText: string;
    markdownSource: string;
    plainText: string;
  };
  imageGeneration: {
    title: string;
    subtitle: string;
    greeting: string;
    useThisImage: string;
    generating: string;
    successMessage: string;
    placeholder: string;
    examplePrompts: string;
  };
  featuredImage: {
    uploadButton: string;
    changeButton: string;
    dragDropText: string;
    clickToUpload: string;
  };
}

export type Language = 'en' | 'zh-CN' | 'zh-TW';
