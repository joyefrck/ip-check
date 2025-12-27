import { NextRequest, NextResponse } from 'next/server';

/**
 * 从请求头中提取客户端真实IP地址
 * 支持常见的CDN和反向代理场景
 */
function getClientIP(request: NextRequest): string | null {
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Nginx/通用反向代理
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) {
    return xRealIP;
  }
  
  // 标准代理链
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  // 其他代理
  const xClientIP = request.headers.get('x-client-ip');
  if (xClientIP) {
    return xClientIP;
  }
  
  // Akamai CDN
  const trueClientIP = request.headers.get('true-client-ip');
  if (trueClientIP) {
    return trueClientIP;
  }
  
  return null;
}

/**
 * 检测是否为本地/内网IP
 */
function isLocalIP(ip: string): boolean {
  if (!ip) return true;
  
  // IPv4 本地地址
  if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.')) {
    return true;
  }
  
  // IPv6 本地地址
  if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('fe80:')) {
    return true;
  }
  
  return false;
}

/**
 * 从第三方服务获取公网IP
 */
async function fetchPublicIP(): Promise<string> {
  try {
    // 优先使用 ipify (支持 IPv4)
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000), // 5秒超时
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error('[IP Detection] Failed to fetch from ipify:', error);
  }
  
  try {
    // 备用: ipify IPv6
    const response = await fetch('https://api64.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error('[IP Detection] Failed to fetch from ipify64:', error);
  }
  
  throw new Error('Unable to detect public IP');
}

/**
 * GET /api/ip
 * 获取客户端公网IP地址
 */
export async function GET(request: NextRequest) {
  try {
    let clientIP = getClientIP(request);
    
    console.log('[IP API] Detected client IP from headers:', clientIP);
    
    // 如果检测到的是本地IP,则通过第三方服务获取公网IP
    if (!clientIP || isLocalIP(clientIP)) {
      console.log('[IP API] Local IP detected, fetching public IP from external service');
      clientIP = await fetchPublicIP();
      console.log('[IP API] Public IP from external service:', clientIP);
    }
    
    return NextResponse.json({ ip: clientIP });
  } catch (error) {
    console.error('[IP API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect IP' },
      { status: 500 }
    );
  }
}
