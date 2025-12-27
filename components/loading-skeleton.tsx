import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';

export function LoadingSkeleton() {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-pulse">
      {/* 地ata Map Skeleton */}
      <div className="lg:col-span-3">
        <Card className="h-[500px] bg-white/5 backdrop-blur-lg border-white/10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-spin" />
              <p className="text-gray-400">{t.loadingMap}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 信息面板骨架屏 */}
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="h-20 bg-white/5 backdrop-blur-lg border-white/10"
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-1/3" />
                <div className="h-4 bg-gray-600 rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
