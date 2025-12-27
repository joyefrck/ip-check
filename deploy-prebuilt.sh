#!/bin/bash

#############################################
# IP-Check 预构建部署脚本
# 跳过服务器构建，直接运行
#############################################

set -e

REPO="https://github.com/joyefrck/ip-check.git"
DIR="/opt/1panel/apps/ip-check"
BRANCH="main"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}开始部署 IP-Check（跳过构建）...${NC}"

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

# 检查是否需要构建
echo -e "${YELLOW}警告：此脚本需要预先构建的镜像${NC}"
echo "如果是首次部署，请先在本地构建镜像或使用其他部署方式"
echo ""

# 尝试直接启动（如果镜像已存在）
echo "尝试启动容器..."
if docker compose up -d 2>/dev/null; then
    sleep 5
    
    if docker ps | grep -q "ip-check"; then
        echo -e "${GREEN}部署成功！${NC}"
        echo ""
        echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
        echo ""
        echo "查看日志: docker compose logs -f"
    else
        echo -e "${RED}容器启动失败，可能需要先构建镜像${NC}"
        echo "请使用以下命令手动构建："
        echo "  cd $DIR"
        echo "  docker compose build"
        echo "  docker compose up -d"
        exit 1
    fi
else
    echo -e "${RED}启动失败，镜像不存在${NC}"
    echo "正在尝试构建镜像（这可能需要较长时间）..."
    docker compose build
    docker compose up -d
    
    sleep 5
    if docker ps | grep -q "ip-check"; then
        echo -e "${GREEN}部署成功！${NC}"
        echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    else
        echo -e "${RED}部署失败${NC}"
        docker compose logs --tail=50
        exit 1
    fi
fi
