import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/language-context";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IP地理位置查询 - 快速查询IP信息和域名定位",
    template: "%s | IP查询工具",
  },
  description: "免费在线IP地理位置查询工具,快速查询IP地址或域名的地理位置、ISP服务商、时区、经纬度等详细信息。支持全球IP查询,提供精准的IP定位服务。",
  keywords: [
    "IP查询",
    "IP地理位置",
    "域名查询",
    "ISP查询",
    "IP定位",
    "IP地址查询",
    "在线IP查询",
    "免费IP查询",
    "IP位置",
    "IP归属地",
    "网络工具",
  ],
  authors: [{ name: "IP查询工具" }],
  creator: "IP查询工具",
  publisher: "IP查询工具",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "IP地理位置查询 - 快速查询IP信息",
    description: "免费在线IP地理位置查询工具,支持IP地址和域名查询,提供ISP、时区、经纬度等详细信息",
    url: '/',
    siteName: 'IP查询工具',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IP地理位置查询工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IP地理位置查询 - 快速查询IP信息',
    description: '免费在线IP地理位置查询工具,支持全球IP查询',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 部署后添加搜索引擎验证码
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
