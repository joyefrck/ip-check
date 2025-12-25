'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 group"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
      <span className="text-sm font-medium text-white">
        {language === 'zh' ? '中文' : 'EN'}
      </span>
      <span className="text-xs text-gray-400">
        {language === 'zh' ? '→ EN' : '→ 中文'}
      </span>
    </button>
  );
}
