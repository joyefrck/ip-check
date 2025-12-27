'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { ExternalLink, Shield, Globe, Zap } from 'lucide-react';

export function VPNBanner() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <a
        href="https://www.elphantroute.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/10 p-6 md:p-8 transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 内容 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* 左侧文案 */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Shield className="w-6 h-6 text-blue-400" aria-hidden="true" />
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {t.vpnBannerTitle}
                </h3>
              </div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {t.vpnBannerDescription}
              </p>
              
              {/* 特性标签 */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.vpnFeatureGlobal}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.vpnFeatureSpeed}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-medium">
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.vpnFeaturePrivacy}
                </span>
              </div>
            </div>

            {/* 右侧按钮 */}
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <span>{t.vpnBannerCta}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* 装饰性光效 */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
        </div>
      </a>
    </div>
  );
}
