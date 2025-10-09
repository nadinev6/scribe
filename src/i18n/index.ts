import { en } from './translations/en';
import { zhCN } from './translations/zh-CN';
import { zhTW } from './translations/zh-TW';
import { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
  'en': en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

export * from './types';
