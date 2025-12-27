import { NextRequest, NextResponse } from 'next/server';
import { lookupIP } from '@/lib/ip-lookup';
import { IPLookupResponse } from '@/types/ip-info';

/**
 * 从请求头中提取客户端真实IP地址
 * 支持常见的CDN和反向代理场景
 */
function getClientIP(request: NextRequest): string | null {
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    console.log('[IP Detection] Using CF-Connecting-IP:', cfConnectingIP);
    return cfConnectingIP;
  }
  
  // Nginx/通用反向代理
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) {
    console.log('[IP Detection] Using X-Real-IP:', xRealIP);
    return xRealIP;
  }
  
  // 标准代理链
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIP = xForwardedFor.split(',')[0].trim();
    console.log('[IP Detection] Using X-Forwarded-For:', firstIP);
    return firstIP;
  }
  
  // 其他代理
  const xClientIP = request.headers.get('x-client-ip');
  if (xClientIP) {
    console.log('[IP Detection] Using X-Client-IP:', xClientIP);
    return xClientIP;
  }
  
  // Akamai CDN
  const trueClientIP = request.headers.get('true-client-ip');
  if (trueClientIP) {
    console.log('[IP Detection] Using True-Client-IP:', trueClientIP);
    return trueClientIP;
  }
  
  console.log('[IP Detection] No client IP found in headers, using ip-api.com auto-detection');
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let query = searchParams.get('query') || undefined;
    
    // 如果没有指定查询参数,尝试从请求头获取客户端IP
    if (!query) {
      const clientIP = getClientIP(request);
      if (clientIP) {
        query = clientIP;
        console.log('[IP Lookup] Using detected client IP:', clientIP);
      } else {
        console.log('[IP Lookup] No client IP detected, using ip-api.com auto-detection');
      }
    }
    
    const data = await lookupIP(query);
    
    const response: IPLookupResponse = {
      success: true,
      data,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: IPLookupResponse = {
      success: false,
      error: error instanceof Error ? error.message : '查询失败',
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}
