import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { IPInfo } from '@/types/ip-info';
import { Globe, MapPin, Building2, Hash, Clock, Navigation, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface IPInfoPanelProps {
  data: IPInfo;
}

export function IPInfoPanel({ data }: IPInfoPanelProps) {
  const { t } = useLanguage();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };
  
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
      copyValue: data.country,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Navigation,
      label: t.city,
      value: `${data.city}, ${data.regionName}`,
      copyValue: `${data.city}, ${data.regionName}`,
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
        {infoItems.map((item, index) => {
          const actualCopyValue = item.copyValue || item.value;
          const isCopied = copiedValue === actualCopyValue;

          return (
            <Card
              key={index}
              className="p-3 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.gradient} shadow-lg shrink-0`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                </div>
                <button
                  onClick={() => handleCopy(actualCopyValue)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title={t.copy || 'Copy'}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 详细信息卡片 */}
      <Card className="p-4 bg-white/5 backdrop-blur-lg border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            {t.details}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {detailItems.map((item, index) => {
            const isCopied = copiedValue === item.value;
            return (
              <div key={index} className="space-y-1 group relative">
                <p className="text-xs text-gray-400">{item.label}</p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-white font-mono truncate">{item.value}</p>
                  <button
                    onClick={() => handleCopy(item.value)}
                    className="shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                </div>
              </div>
            );
          })}
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
