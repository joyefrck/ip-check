'use client';

import { Card } from '@/components/ui/card';
import { IPInfo } from '@/types/ip-info';
import { Globe, MapPin, Building2, Hash, Clock, Navigation } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface IPInfoPanelProps {
  data: IPInfo;
}

export function IPInfoPanel({ data }: IPInfoPanelProps) {
  const { t } = useLanguage();
  
  const infoItems = [
    {
      icon: Globe,
      label: t.ipAddress,
      value: data.ip,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      label: t.country,
      value: `${getFlagEmoji(data.countryCode)} ${data.country}`,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Navigation,
      label: t.city,
      value: `${data.city}, ${data.regionName}`,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Hash,
      label: t.postalCode,
      value: data.zip || t.unknown,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Building2,
      label: t.isp,
      value: data.isp,
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Clock,
      label: t.timezone,
      value: data.timezone,
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  const detailItems = [
    { label: t.longitude, value: data.lon.toFixed(4) },
    { label: t.latitude, value: data.lat.toFixed(4) },
    { label: t.asn, value: data.as },
    { label: t.organization, value: data.org },
  ];

  return (
    <div className="space-y-3">
      {/* 主要信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
          <Card
            key={index}
            className="p-3 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-white truncate">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 详细信息卡片 */}
      <Card className="p-4 bg-white/5 backdrop-blur-lg border-white/10">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-400" />
          {t.details}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {detailItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-sm text-white font-mono">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// 获取国旗emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
