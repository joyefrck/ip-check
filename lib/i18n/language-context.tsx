'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './index';

// 亚太地区国家代码
const ASIA_PACIFIC_COUNTRIES = [
  'CN', 'JP', 'KR', 'TW', 'HK', 'MO', 'SG', 'MY', 'TH', 
  'VN', 'ID', 'PH', 'IN', 'BD', 'PK', 'LK', 'MM', 'KH',
  'LA', 'BN', 'NP', 'BT', 'MV', 'AU', 'NZ', 'FJ', 'PG'
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化语言
  useEffect(() => {
    const initLanguage = async () => {
      // 1. 检查localStorage中的用户选择
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        setLanguageState(savedLang);
        setIsInitialized(true);
        return;
      }

      // 2. 根据用户IP检测默认语言
      try {
        const response = await fetch('/api/lookup');
        const data = await response.json();
        
        if (data.success && data.data) {
          const countryCode = data.data.countryCode;
          const defaultLang = ASIA_PACIFIC_COUNTRIES.includes(countryCode) ? 'zh' : 'en';
          setLanguageState(defaultLang);
          localStorage.setItem('language', defaultLang);
        }
      } catch (error) {
        // 如果检测失败,默认使用中文
        console.error('Failed to detect language:', error);
        setLanguageState('zh');
      }
      
      setIsInitialized(true);
    };

    initLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // 更新html lang属性
    document.documentElement.lang = lang;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  // 在初始化完成前不渲染子组件,避免闪烁
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
