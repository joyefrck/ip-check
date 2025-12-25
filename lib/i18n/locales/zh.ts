export const zh = {
  // 页面标题
  title: 'IP地理位置查询',
  description: '快速查询IP地址或域名的地理位置、ISP信息及详细数据',
  
  // 搜索框
  searchPlaceholder: '输入IP地址或域名',
  searchButton: '查询',
  searching: '查询中...',
  
  // 信息面板标签
  ipAddress: 'IP地址',
  country: '国家/地区',
  city: '城市',
  postalCode: '邮政编码',
  isp: 'ISP服务商',
  timezone: '时区',
  details: '详细信息',
  longitude: '经度',
  latitude: '纬度',
  asn: 'ASN',
  organization: '组织',
  
  // 状态消息
  queryFailed: '查询失败',
  loadingMap: '加载地图中...',
  loading: '加载中...',
  
  // 页脚
  dataSource: '数据来源',
  mapService: '地图服务',
  
  // 错误消息
  networkError: '网络错误,请稍后重试',
  invalidInput: '请输入有效的IP地址或域名',
};

export type Translations = typeof zh;
