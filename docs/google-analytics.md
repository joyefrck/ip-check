# Google Analytics 接入指南

本文档介绍如何为 IP-Check 项目配置 Google Analytics 4 (GA4),用于统计网站访问量和访问来源。

## 📊 功能特性

- ✅ 自动跟踪页面浏览量 (PV)
- ✅ 统计访问来源和流量渠道
- ✅ 记录用户地理位置分布
- ✅ 自定义事件跟踪(IP查询、语言切换等)
- ✅ 实时访问数据监控

## 🚀 配置步骤

### 1. 创建 Google Analytics 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 使用 Google 账号登录
3. 点击"开始衡量"创建新账号

### 2. 创建 GA4 媒体资源

1. 在 Google Analytics 管理界面,点击左下角"管理"
2. 在"媒体资源"列中,点击"创建媒体资源"
3. 填写媒体资源名称(例如: IP-Check)
4. 选择时区和货币
5. 点击"下一步"

### 3. 设置数据流

1. 选择平台类型:"网站"
2. 填写网站信息:
   - **网站网址**: 你的域名(例如: `https://ip.example.com`)
   - **数据流名称**: IP-Check Website
3. 点击"创建数据流"

### 4. 获取测量 ID

创建数据流后,你会看到一个测量 ID,格式为 `G-XXXXXXXXXX`。

![GA4 测量 ID 示例](https://developers.google.com/static/analytics/devguides/collection/ga4/images/measurement-id.png)

### 5. 配置环境变量

#### 本地开发环境

在项目根目录创建 `.env.local` 文件:

```bash
# 复制示例文件
cp .env.example .env.local
```

编辑 `.env.local`,填入你的测量 ID:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 生产环境(Docker)

编辑 `docker-compose.yml`,在 `environment` 部分添加:

```yaml
services:
  ip-check:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 替换为你的测量 ID
```

#### 1Panel 部署

在 1Panel 的容器编辑界面,添加环境变量:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 6. 重启应用

**本地开发:**
```bash
# 停止当前服务 (Ctrl+C)
# 重新启动
npm run dev
```

**Docker 部署:**
```bash
docker compose down
docker compose up -d --build
```

## 📈 验证配置

### 方法一:实时报告

1. 访问你的网站
2. 在 Google Analytics 中,点击左侧菜单"报告" → "实时"
3. 应该能看到当前的活跃用户

### 方法二:浏览器控制台

1. 打开网站
2. 按 F12 打开开发者工具
3. 在 Console 中输入:
   ```javascript
   window.gtag
   ```
4. 如果返回一个函数,说明 GA4 已正确加载

### 方法三:Network 面板

1. 打开开发者工具的 Network 面板
2. 刷新页面
3. 搜索 `google-analytics` 或 `gtag`
4. 应该能看到相关的网络请求

## 🎯 自定义事件跟踪

项目已内置了一些自定义事件跟踪函数,你可以在代码中使用:

### IP 查询事件

```typescript
import { trackIPSearch } from '@/lib/analytics';

// 跟踪 IP 查询
trackIPSearch('8.8.8.8', 'ip');

// 跟踪域名查询
trackIPSearch('google.com', 'domain');
```

### 语言切换事件

```typescript
import { trackLanguageChange } from '@/lib/analytics';

// 跟踪语言切换
trackLanguageChange('zh-CN');
trackLanguageChange('en-US');
```

### 自定义事件

```typescript
import { event } from '@/lib/analytics';

// 发送自定义事件
event({
  action: 'button_click',
  category: 'User_Interaction',
  label: 'export_results',
  value: 1,
});
```

## 📊 查看统计数据

### 实时数据

**路径**: 报告 → 实时

查看当前在线用户、访问页面、流量来源等实时数据。

### 流量获取

**路径**: 报告 → 生命周期 → 流量获取

查看用户来源渠道:
- 直接访问 (Direct)
- 搜索引擎 (Organic Search)
- 社交媒体 (Social)
- 引荐网站 (Referral)

### 用户属性

**路径**: 报告 → 用户 → 用户属性

查看用户地理位置、设备类型、浏览器等信息。

### 事件统计

**路径**: 报告 → 互动度 → 事件

查看所有自定义事件的触发次数和详细数据。

## 🔧 高级配置

### 排除内部流量

1. 在 GA4 管理界面,点击"数据流"
2. 点击你的网站数据流
3. 在"Google 代码"部分,点击"配置代码设置"
4. 点击"定义内部流量"
5. 添加你的 IP 地址或 IP 范围

### 设置转化事件

1. 在 GA4 管理界面,点击"事件"
2. 找到你想标记为转化的事件(如 `search`)
3. 切换"标记为转化"开关

### 创建自定义报告

1. 点击左侧菜单"探索"
2. 选择模板或创建空白报告
3. 自定义维度和指标

## 🛡️ 隐私合规

### Cookie 同意

如果你的网站面向欧盟用户,需要实现 Cookie 同意机制。可以考虑使用:

- [CookieYes](https://www.cookieyes.com/)
- [OneTrust](https://www.onetrust.com/)
- [Cookiebot](https://www.cookiebot.com/)

### 数据保留

1. 在 GA4 管理界面,点击"数据设置" → "数据保留"
2. 设置事件数据保留期限(2个月或14个月)

## 📚 相关资源

- [GA4 官方文档](https://support.google.com/analytics/answer/10089681)
- [Next.js Analytics 集成指南](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Google Analytics 4 入门指南](https://developers.google.com/analytics/devguides/collection/ga4)

## ❓ 常见问题

### Q: 为什么看不到数据?

A: 
- 检查测量 ID 是否正确配置
- 确认环境变量已正确设置并重启应用
- GA4 数据可能有 24-48 小时延迟,但实时报告应该立即显示
- 检查浏览器是否安装了广告拦截插件

### Q: 如何查看昨天的数据?

A: 进入"报告" → "生命周期" → "流量获取",在右上角选择日期范围。

### Q: 本地开发时会统计数据吗?

A: 会的。如果不想统计本地开发数据,可以:
1. 在 `.env.local` 中不设置 `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. 或在 GA4 中设置内部流量过滤

### Q: 如何导出数据?

A: 在任何报告页面,点击右上角的"分享"图标,选择"下载文件"(CSV 或 PDF)。

## 🎉 完成

现在你的 IP-Check 网站已经成功接入 Google Analytics 4!你可以实时监控网站访问情况,了解用户行为,优化产品体验。
