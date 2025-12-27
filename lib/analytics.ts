// Google Analytics 事件跟踪工具

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

// 页面浏览事件
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

// 自定义事件
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// IP 查询事件
export const trackIPSearch = (ipOrDomain: string, type: 'ip' | 'domain') => {
  event({
    action: 'search',
    category: 'IP_Check',
    label: type,
  });
};

// 语言切换事件
export const trackLanguageChange = (language: string) => {
  event({
    action: 'language_change',
    category: 'User_Interaction',
    label: language,
  });
};
