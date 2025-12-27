# 快速部署指南

本文档提供 IP-Check 项目的快速部署方法。

## 一键部署（推荐）

### 前置要求

- ✅ 服务器已安装 Docker 和 Docker Compose
- ✅ 服务器已安装 Git
- ✅ 服务器可以访问 GitHub

### 部署步骤

**推荐方法：使用简化脚本（适用于已安装 docker-compose-plugin 的服务器）**

```bash
# SSH 连接到服务器
ssh root@你的服务器IP

# 下载并执行简化部署脚本
curl -fsSL https://raw.githubusercontent.com/joyefrck/ip-check/main/deploy-simple.sh | bash
```

**备选方法：使用完整脚本（自动检测 Docker Compose 版本）**

```bash
# 下载并执行完整部署脚本
curl -fsSL https://raw.githubusercontent.com/joyefrck/ip-check/main/server-deploy.sh | bash
```

3. **等待部署完成**

脚本会自动完成以下操作：
- ✅ 检查环境依赖
- ✅ 从 GitHub 克隆代码到 `/opt/1panel/apps/ip-check`
- ✅ 配置环境变量
- ✅ 构建 Docker 镜像
- ✅ 启动容器
- ✅ 执行健康检查

4. **访问应用**

部署成功后，访问：`http://你的服务器IP:3000`

---

## 手动部署

如果你想手动控制每一步，可以按照以下步骤操作：

### 1. 克隆代码

```bash
cd /opt/1panel/apps/
git clone https://github.com/joyefrck/ip-check.git ip-check
cd ip-check
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 根据需要编辑 .env 文件
```

### 3. 启动容器

```bash
docker-compose up -d --build
```

### 4. 验证部署

```bash
# 查看容器状态
docker ps | grep ip-check

# 查看日志
docker-compose logs -f
```

---

## 更新应用

### 使用自动化脚本更新

```bash
cd /opt/1panel/apps/ip-check
./server-deploy.sh
```

### 手动更新

```bash
cd /opt/1panel/apps/ip-check

# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose down
docker-compose up -d --build
```

---

## 常用运维命令

### 查看容器状态

```bash
docker ps | grep ip-check
```

### 查看实时日志

```bash
cd /opt/1panel/apps/ip-check
docker-compose logs -f
```

### 重启容器

```bash
cd /opt/1panel/apps/ip-check
docker-compose restart
```

### 停止容器

```bash
cd /opt/1panel/apps/ip-check
docker-compose down
```

### 进入容器

```bash
docker exec -it ip-check sh
```

### 清理旧镜像

```bash
docker image prune -a
```

---

## 配置反向代理（可选）

如果你想通过域名访问（如 `https://ip.yourdomain.com`），需要配置反向代理。

### 使用 1Panel 配置

1. 进入 **网站** → **网站**
2. 点击 **创建网站** → **反向代理**
3. 填写配置：
   - **域名**：`ip.yourdomain.com`
   - **代理地址**：`http://127.0.0.1:3000`
   - **启用 HTTPS**：开启
   - **自动申请证书**：开启
4. 点击 **确认**

### 使用 Nginx 配置

```nginx
server {
    listen 80;
    server_name ip.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ip.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs --tail=100

# 检查端口占用
netstat -tulpn | grep 3000

# 检查 Docker 服务
systemctl status docker
```

### 无法访问应用

```bash
# 检查容器是否运行
docker ps | grep ip-check

# 测试本地访问
curl http://localhost:3000

# 检查防火墙
firewall-cmd --list-ports  # CentOS/RHEL
ufw status                  # Ubuntu/Debian
```

### 更新失败

```bash
# 回滚到上一个版本
cd /opt/1panel/apps/ip-check
git log --oneline -5  # 查看最近的提交
git reset --hard <commit-hash>  # 回滚到指定提交
docker-compose up -d --build
```

---

## 安全建议

1. ✅ 使用 HTTPS（通过反向代理配置 SSL）
2. ✅ 配置防火墙，只开放必要端口
3. ✅ 定期更新 Docker 镜像
4. ✅ 定期备份数据
5. ✅ 使用非 root 用户运行（已在 Dockerfile 中配置）

---

## 性能优化

### 配置资源限制

编辑 `docker-compose.yml`，添加：

```yaml
services:
  ip-check:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 配置日志轮转

```yaml
services:
  ip-check:
    # ... 其他配置
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 获取帮助

- 📖 详细部署文档：[docs/1panel-deployment.md](./docs/1panel-deployment.md)
- 🐛 问题反馈：[GitHub Issues](https://github.com/joyefrck/ip-check/issues)
- 📝 项目文档：[README.md](./README.md)
