#!/bin/bash

#############################################
# IP-Check 简化部署脚本
# 适用于已安装 docker-compose-plugin 的服务器
#############################################

set -e

# 配置
REPO="https://github.com/joyefrck/ip-check.git"
DIR="/opt/1panel/apps/ip-check"
BRANCH="main"

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}开始部署 IP-Check...${NC}"

# 1. 同步代码
if [ -d "$DIR" ]; then
    echo "更新代码..."
    cd "$DIR"
    git pull origin $BRANCH
else
    echo "克隆代码..."
    git clone -b $BRANCH "$REPO" "$DIR"
    cd "$DIR"
fi

# 2. 配置环境
if [ ! -f ".env" ]; then
    echo "创建 .env 文件..."
    cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
fi

# 3. 停止旧容器
echo "停止旧容器..."
docker compose down 2>/dev/null || true

# 4. 构建并启动
echo "构建并启动容器..."
docker compose build --no-cache
docker compose up -d

# 5. 等待启动
echo "等待应用启动..."
sleep 5

# 6. 检查状态
if docker ps | grep -q "ip-check"; then
    echo -e "${GREEN}部署成功！${NC}"
    echo ""
    echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker compose logs -f"
    echo "  重启: docker compose restart"
    echo "  停止: docker compose down"
else
    echo -e "${RED}部署失败，查看日志:${NC}"
    docker compose logs --tail=50
    exit 1
fi
