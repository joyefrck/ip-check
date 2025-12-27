#!/bin/bash

#############################################
# IP-Check 快速部署脚本（使用缓存）
#############################################

set -e

REPO="https://github.com/joyefrck/ip-check.git"
DIR="/opt/1panel/apps/ip-check"
BRANCH="main"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}开始快速部署 IP-Check...${NC}"

# 同步代码
if [ -d "$DIR" ]; then
    echo "更新代码..."
    cd "$DIR"
    git pull origin $BRANCH
else
    echo "克隆代码..."
    git clone -b $BRANCH "$REPO" "$DIR"
    cd "$DIR"
fi

# 配置环境
if [ ! -f ".env" ]; then
    cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
fi

# 停止旧容器
echo "停止旧容器..."
docker compose down 2>/dev/null || true

# 构建并启动（使用缓存，速度更快）
echo "构建镜像（使用缓存加速）..."
docker compose build

echo "启动容器..."
docker compose up -d

# 等待启动
echo "等待应用启动..."
sleep 5

# 检查状态
if docker ps | grep -q "ip-check"; then
    echo -e "${GREEN}部署成功！${NC}"
    echo ""
    echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    echo ""
    echo "查看日志: docker compose logs -f"
else
    echo -e "${RED}部署失败${NC}"
    docker compose logs --tail=50
    exit 1
fi
