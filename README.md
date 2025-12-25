# IP-Check

一个现代化的 IP 检测，支持多语言界面。

## 功能特性

- 🌍 IP 地理位置检测
- 🏢 ISP 信息识别
- 🌐 多语言支持（中文/英文）
- 🗺️ 可视化地图展示
- 🐳 Docker 一键部署

## 快速开始

### 使用 Docker 部署（推荐）

#### 一键部署

```bash
# 克隆项目
git clone https://github.com/joyefrck/ip-check.git
cd ip-check

# 运行一键部署脚本
./deploy.sh
```

部署脚本会自动完成以下操作：
- ✓ 检查 Docker 环境
- ✓ 构建 Docker 镜像
- ✓ 启动容器
- ✓ 健康检查
- ✓ 显示访问地址

#### 手动部署

```bash
# 克隆项目（如果还没有）
git clone https://github.com/joyefrck/ip-check.git
cd ip-check

# 使用 docker-compose
docker-compose up -d

# 或使用 docker compose（新版本）
docker compose up -d
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

#### Docker 常用命令

```bash
# 查看日志
docker logs -f ip-check

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看容器状态
docker ps

# 重新构建并启动
docker-compose up -d --build
```

#### 使用 1Panel 部署

如果你使用 1Panel 面板管理服务器，请查看详细的 [1Panel 部署指南](docs/1panel-deployment.md)。

---

### 本地开发

#### 环境要求

- Node.js 20+
- npm 或 yarn

#### 安装依赖

```bash
npm install
# 或
yarn install
```

#### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

#### 构建生产版本

```bash
npm run build
npm start
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

可配置项：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 应用端口 | `3000` |
| `NODE_ENV` | 运行环境 | `production` |

## 技术栈

- **框架**: [Next.js 16](https://nextjs.org)
- **UI 库**: [React 19](https://react.dev)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com)
- **组件**: [Radix UI](https://www.radix-ui.com)
- **地图**: [Leaflet](https://leafletjs.com)
- **图标**: [Lucide React](https://lucide.dev)

## 项目结构

```
IP-Check/
├── app/                # Next.js 应用目录
│   ├── api/           # API 路由
│   └── page.tsx       # 主页面
├── components/        # React 组件
├── lib/              # 工具函数和配置
├── public/           # 静态资源
├── types/            # TypeScript 类型定义
├── Dockerfile        # Docker 镜像配置
├── docker-compose.yml # Docker Compose 配置
└── deploy.sh         # 一键部署脚本
```

## 常见问题

### Docker 部署相关

**Q: 如何修改端口？**

A: 编辑 `.env` 文件，修改 `PORT` 变量，然后重启容器：
```bash
docker-compose down
docker-compose up -d
```

**Q: 如何查看容器日志？**

A: 使用以下命令：
```bash
docker logs -f ip-check
```

**Q: 如何更新应用？**

A: 拉取最新代码后重新构建：
```bash
git pull
docker-compose up -d --build
```

## 开发指南

### 添加新的流媒体服务检测

1. 在 `lib/services/` 目录下创建新的服务检测文件
2. 在 `app/api/check/route.ts` 中添加检测逻辑
3. 在前端组件中添加显示逻辑

### 添加新语言

1. 在 `lib/i18n/locales/` 目录下创建新的语言文件
2. 在 `lib/i18n/config.ts` 中注册新语言
3. 更新语言切换组件

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

