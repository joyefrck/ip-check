'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';

interface MapViewProps {
  lat: number;
  lon: number;
  city: string;
}

export function MapView({ lat, lon, city }: MapViewProps) {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // 动态导入Leaflet以避免SSR问题
    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore - CSS import for styling
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !mapRef.current) return;

      // 清理旧地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // 创建地图实例
      const map = L.map(mapRef.current).setView([lat, lon], 10);
      mapInstanceRef.current = map;

      // 添加地图图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // 自定义标记图标
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="absolute -top-10 -left-5 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
            <div class="absolute -top-8 -left-3 w-6 h-6 bg-white rounded-full border-2 border-blue-500"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      // 添加标记
      L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${city}</strong><br/>${t.coordinates}: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
        .openPopup();
    };

    initMap();

    // 清理函数
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, lat, lon, city, t]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-800/50 flex items-center justify-center">
        <div className="text-gray-400">{t.loadingMap}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}
