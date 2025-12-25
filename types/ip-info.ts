export interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query?: string;
}

export interface IPLookupResponse {
  success: boolean;
  data?: IPInfo;
  error?: string;
}
