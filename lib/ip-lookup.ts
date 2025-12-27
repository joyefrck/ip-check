import { IPInfo } from '@/types/ip-info';

/**
 * 查询IP地理位置信息
 * @param query IP地址或域名,为空则查询当前用户IP
 */
export async function lookupIP(query?: string): Promise<IPInfo> {
  const fields = 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query';
  const url = query 
    ? `http://ip-api.com/json/${encodeURIComponent(query)}?fields=${fields}`
    : `http://ip-api.com/json/?fields=${fields}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // 缓存1小时
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP查询失败');
    }
    
    return {
      ip: data.query,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      zip: data.zip,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      as: data.as,
    };
  } catch (error) {
    console.error('[IP Lookup] Error:', error);
    throw error;
  }
}

/**
 * 验证IP地址格式
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
  const ipv6Regex = /^(?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}$|^(?:[a-fA-F\d]{1,4}:){1,7}:$|^(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}$|^(?:[a-fA-F\d]{1,4}:){1,5}(?::[a-fA-F\d]{1,4}){1,2}$|^(?:[a-fA-F\d]{1,4}:){1,4}(?::[a-fA-F\d]{1,4}){1,3}$|^(?:[a-fA-F\d]{1,4}:){1,3}(?::[a-fA-F\d]{1,4}){1,4}$|^(?:[a-fA-F\d]{1,4}:){1,2}(?::[a-fA-F\d]{1,4}){1,5}$^[a-fA-F\d]{1,4}:(?::[a-fA-F\d]{1,4}){1,6}$|^:(?::[a-fA-F\d]{1,4}){1,7}$|^::$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * 验证域名格式
 */
export function isValidDomain(domain: string): boolean {
  // 更加健壮的域名正则,支持多级子域名和常见顶级域名
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
  return domainRegex.test(domain);
}
