import { zh } from './locales/zh';
import { en } from './locales/en';

export const translations = {
  zh,
  en,
};

export type Language = keyof typeof translations;
export type { Translations } from './locales/zh';
