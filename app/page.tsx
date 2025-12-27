'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { MapView } from '@/components/map-view';
import { IPInfoPanel } from '@/components/ip-info-panel';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { LanguageSwitcher } from '@/components/language-switcher';
import { VPNBanner } from '@/components/vpn-banner';
import { IPInfo, IPLookupResponse } from '@/types/ip-info';
import { Card } from '@/components/ui/card';
import { Globe, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Home() {
  const { t, language } = useLanguage();
  const [ipData, setIpData] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 更新页面标题和语言属性
  useEffect(() => {
    document.title = t.title + ' - ' + t.description;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [t, language]);

  // 初始加载当前用户IP
  useEffect(() => {
    fetchIPData();
  }, []);


  const fetchIPData = async (query?: string) => {
    setLoading(true);
    setError('');

    try {
      const url = query ? `/api/lookup?query=${encodeURIComponent(query)}` : '/api/lookup';
      const response = await fetch(url);
      const data: IPLookupResponse = await response.json();

      if (data.success && data.data) {
        setIpData(data.data);
      } else {
        setError(data.error || t.queryFailed);
      }
    } catch (err) {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'IP地理位置查询工具',
            description: '免费在线IP地理位置查询工具,快速查询IP地址或域名的地理位置、ISP服务商、时区等详细信息',
            url: 'http://localhost:3000',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'CNY',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1000',
            },
            author: {
              '@type': 'Organization',
              name: 'IP查询工具',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 语言切换器 */}
        <LanguageSwitcher />
        
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-4 space-y-4">
          {/* 头部 */}
          <header className="text-center space-y-3 pt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50" aria-hidden="true">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              {t.description}
            </p>
          </header>

          {/* 搜索栏 */}
          <section aria-label="IP查询搜索" className="flex justify-center">
            <SearchBar onSearch={fetchIPData} loading={loading} />
          </section>

          {/* 结果展示区域 */}
          <main aria-label="查询结果">
            {loading && !ipData ? (
              <LoadingSkeleton />
            ) : error ? (
              <Card className="p-12 bg-white/5 backdrop-blur-lg border-white/10 text-center" role="alert">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-white mb-2">{t.queryFailed}</h3>
                <p className="text-gray-400">{error}</p>
              </Card>
            ) : ipData ? (
              <article className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 左侧地图 */}
                <section aria-label="地图展示" className="lg:col-span-3">
                  <Card className="p-3 bg-white/5 backdrop-blur-lg border-white/10 h-full">
                    <MapView lat={ipData.lat} lon={ipData.lon} city={ipData.city} />
                  </Card>
                </section>

                {/* 右侧信息面板 */}
                <aside aria-label="IP详细信息" className="lg:col-span-2">
                  <IPInfoPanel data={ipData} />
                </aside>
              </article>
            ) : null}
          </main>

          {/* VPN 广告 */}
          <VPNBanner />

          {/* 页脚 */}
          <footer className="text-center text-gray-500 text-xs pt-4">
            <p>{t.dataSource}: ip-api.com | {t.mapService}: OpenStreetMap</p>
          </footer>
        </div>
      </div>
    </>
  );
}
