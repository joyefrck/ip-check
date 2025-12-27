# 🚀 生产环境部署指南 (预构建镜像模式)

本教程介绍如何利用 GitHub Actions 自动构建镜像，并快速部署到生产服务器（如 1Panel）。这是目前 **IP-Check** 项目推荐的生产部署流程。

---

## 🏗️ 自动化构建原理

项目配置了 GitHub Actions (`.github/workflows/docker-build.yml`)：
1. **自动触发**：每当代码推送到 `main` 分支时运行。
2. **变量注入**：在构建时会自动注入 Google Analytics 测量 ID (`G-B9VB82JWVJ`) 到前端。
3. **镜像同步**：构建成功的镜像会推送到 GitHub Container Registry (GHCR)。
   - 镜像地址：`ghcr.io/joyefrck/ip-check:latest`

---

## ⚙️ 1Panel 环境配置

在生产服务器上，您需要确保容器拥有正确的环境变量：

1. **进入 1Panel 控制台**。
2. **容器 -> 容器**，找到 `ip-check`。
3. **编辑环境变量**，确保包含以下内容：
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: `G-B9VB82JWVJ` (虽然构建时已注入，但建议保留以备万一)

---

## 🔄 生产环境更新命令

每当您在本地完成开发并 `git push` 后，请等待 3 分钟（等待 GitHub Actions 完成构建），然后执行以下命令更新线上版本：

```bash
# 1. 进入应用目录
cd /opt/1panel/apps/ip-check

# 2. 停止旧容器
docker compose -f docker-compose.prod.yml down

# 3. 拉取最新的 GitHub 预构建镜像
docker pull ghcr.io/joyefrck/ip-check:latest

# 4. 重新启动
docker compose -f docker-compose.prod.yml up -d
```

---

## 🛠️ 故障排查

- **GA 不生效**：请检查浏览器控制台 (`F12`) 是否有 `window.gtag` 函数。如果没有，说明构建参数未成功注入，请检查 `.github/workflows/docker-build.yml`。
- **查询 403**：检查服务器是否有 WAF 拦截或是否触发了 API 提供商的速率限制。
- **搜索框不填充 IP**：请确保线上版本是最新代码（包含 `components/search-bar.tsx` 的修复）。

---

## 📄 相关资源
- [1Panel 部署文档](1panel-deployment.md)
- [GA 接入指南](google-analytics.md)
