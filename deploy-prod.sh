#!/bin/bash

#############################################
# IP-Check 生产环境部署脚本
# 使用预构建的 Docker 镜像
#############################################

set -e

REPO="https://github.com/joyefrck/ip-check.git"
DIR="/opt/1panel/apps/ip-check"
BRANCH="main"
IMAGE="ghcr.io/joyefrck/ip-check:latest"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}开始部署 IP-Check（使用预构建镜像）...${NC}"

# 同步代码（只需要 docker-compose 文件）
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
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# 拉取最新镜像
echo "拉取最新镜像..."
docker pull $IMAGE

# 启动容器
echo "启动容器..."
docker compose -f docker-compose.prod.yml up -d

# 等待启动
echo "等待应用启动..."
sleep 5

# 检查状态
if docker ps | grep -q "ip-check"; then
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}部署成功！${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    echo "容器名称: ip-check"
    echo "部署目录: $DIR"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker compose -f docker-compose.prod.yml logs -f"
    echo "  重启容器: docker compose -f docker-compose.prod.yml restart"
    echo "  停止容器: docker compose -f docker-compose.prod.yml down"
    echo "  更新应用: curl -fsSL https://raw.githubusercontent.com/joyefrck/ip-check/main/deploy-prod.sh | bash"
    echo ""
else
    echo -e "${RED}部署失败，查看日志:${NC}"
    docker compose -f docker-compose.prod.yml logs --tail=50
    exit 1
fi
