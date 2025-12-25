#!/bin/bash

# IP-Check Docker 一键部署脚本
# 使用方法: ./deploy.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# 打印标题
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  IP-Check Docker 一键部署${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 检查 Docker 是否安装
check_docker() {
    print_info "检查 Docker 环境..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        echo "访问 https://docs.docker.com/get-docker/ 获取安装指南"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker 服务未运行，请启动 Docker"
        exit 1
    fi
    
    print_success "Docker 环境检查通过"
}

# 检查 Docker Compose 是否安装
check_docker_compose() {
    print_info "检查 Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安装"
        exit 1
    fi
    
    print_success "Docker Compose 检查通过"
}

# 创建 .env 文件（如果不存在）
setup_env() {
    if [ ! -f .env ]; then
        print_info "创建 .env 配置文件..."
        cp .env.example .env
        print_success ".env 文件已创建，使用默认配置"
    else
        print_info "使用现有的 .env 配置文件"
    fi
}

# 停止并删除旧容器
cleanup_old_containers() {
    print_info "清理旧容器..."
    
    if docker ps -a | grep -q ip-check; then
        docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
        print_success "旧容器已清理"
    else
        print_info "没有需要清理的旧容器"
    fi
}

# 构建镜像
build_image() {
    print_info "开始构建 Docker 镜像..."
    echo "这可能需要几分钟时间，请耐心等待..."
    
    if docker-compose build 2>/dev/null || docker compose build 2>/dev/null; then
        print_success "镜像构建成功"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 启动容器
start_container() {
    print_info "启动容器..."
    
    if docker-compose up -d 2>/dev/null || docker compose up -d 2>/dev/null; then
        print_success "容器启动成功"
    else
        print_error "容器启动失败"
        exit 1
    fi
}

# 等待服务就绪
wait_for_service() {
    print_info "等待服务启动..."
    
    local max_attempts=30
    local attempt=1
    local port=${PORT:-3000}
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port > /dev/null 2>&1; then
            print_success "服务已就绪"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo ""
    print_warning "服务启动超时，但容器可能仍在初始化中"
    print_info "请稍后手动检查: docker logs ip-check"
}

# 显示部署信息
show_info() {
    local port=${PORT:-3000}
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  部署成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${BLUE}http://localhost:$port${NC}"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker logs -f ip-check"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
    echo "  查看状态: docker ps"
    echo ""
}

# 主函数
main() {
    print_header
    
    # 加载环境变量
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    check_docker
    check_docker_compose
    setup_env
    cleanup_old_containers
    build_image
    start_container
    wait_for_service
    show_info
}

# 运行主函数
main
