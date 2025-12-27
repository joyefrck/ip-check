#!/bin/bash

#############################################
# IP-Check 服务器部署脚本
# 用途: 自动从 GitHub 拉取代码并部署到服务器
# 作者: Auto-generated
# 日期: 2025-12-27
#############################################

set -e  # 遇到错误立即退出

# 配置变量
GITHUB_REPO="https://github.com/joyefrck/ip-check.git"
DEPLOY_DIR="/opt/1panel/apps/ip-check"
CONTAINER_NAME="ip-check"
BRANCH="main"  # 或者 master，根据你的仓库主分支名称

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# 检测 Docker Compose 命令
detect_docker_compose() {
    if docker compose version &> /dev/null; then
        echo "docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        return 1
    fi
}

# 环境检查
check_environment() {
    log_info "检查部署环境..."
    
    # 检查 Git
    if ! check_command "git"; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi
    
    # 检查 Docker
    if ! check_command "docker"; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查 Docker Compose
    DOCKER_COMPOSE_CMD=$(detect_docker_compose)
    if [ $? -ne 0 ]; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        log_info "安装方法："
        log_info "  方法1: apt-get install docker-compose-plugin  # Ubuntu/Debian"
        log_info "  方法2: yum install docker-compose-plugin      # CentOS/RHEL"
        log_info "  方法3: curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
        exit 1
    fi
    
    log_info "检测到 Docker Compose 命令: $DOCKER_COMPOSE_CMD"
    log_info "环境检查通过 ✓"
}

# 克隆或更新代码
sync_code() {
    log_info "同步代码..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        log_info "目录已存在，拉取最新代码..."
        cd "$DEPLOY_DIR"
        
        # 保存本地修改（如果有）
        if [ -n "$(git status --porcelain)" ]; then
            log_warn "检测到本地修改，将被暂存..."
            git stash
        fi
        
        # 拉取最新代码
        git fetch origin
        git checkout $BRANCH
        git pull origin $BRANCH
        
        log_info "代码更新完成 ✓"
    else
        log_info "克隆仓库到 $DEPLOY_DIR..."
        
        # 创建父目录（如果不存在）
        mkdir -p "$(dirname "$DEPLOY_DIR")"
        
        # 克隆仓库
        git clone -b $BRANCH "$GITHUB_REPO" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
        
        log_info "代码克隆完成 ✓"
    fi
}

# 配置环境变量
setup_env() {
    log_info "配置环境变量..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_info "已从 .env.example 创建 .env 文件"
        else
            # 创建默认 .env 文件
            cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
            log_info "已创建默认 .env 文件"
        fi
    else
        log_info ".env 文件已存在，跳过创建"
    fi
    
    log_info "环境变量配置完成 ✓"
}

# 停止旧容器
stop_old_container() {
    log_info "停止旧容器..."
    
    if docker ps -a | grep -q "$CONTAINER_NAME"; then
        $DOCKER_COMPOSE_CMD down
        log_info "旧容器已停止 ✓"
    else
        log_info "没有运行中的容器"
    fi
}

# 构建并启动容器
build_and_start() {
    log_info "构建并启动容器..."
    
    # 构建镜像
    $DOCKER_COMPOSE_CMD build --no-cache
    
    # 启动容器
    $DOCKER_COMPOSE_CMD up -d
    
    log_info "容器启动完成 ✓"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待容器启动
    sleep 5
    
    # 检查容器状态
    if docker ps | grep -q "$CONTAINER_NAME"; then
        log_info "容器运行正常 ✓"
        
        # 检查应用响应
        max_attempts=10
        attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if curl -f http://localhost:3000 > /dev/null 2>&1; then
                log_info "应用响应正常 ✓"
                return 0
            fi
            
            log_warn "等待应用启动... ($attempt/$max_attempts)"
            sleep 3
            attempt=$((attempt + 1))
        done
        
        log_error "应用启动超时，请检查日志"
        $DOCKER_COMPOSE_CMD logs --tail=50
        return 1
    else
        log_error "容器启动失败"
        $DOCKER_COMPOSE_CMD logs --tail=50
        return 1
    fi
}

# 显示部署信息
show_info() {
    log_info "================================"
    log_info "部署完成！"
    log_info "================================"
    echo ""
    echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    echo "容器名称: $CONTAINER_NAME"
    echo "部署目录: $DEPLOY_DIR"
    echo ""
    echo "常用命令:"
    echo "  查看日志: $DOCKER_COMPOSE_CMD logs -f"
    echo "  重启容器: $DOCKER_COMPOSE_CMD restart"
    echo "  停止容器: $DOCKER_COMPOSE_CMD down"
    echo "  进入容器: docker exec -it $CONTAINER_NAME sh"
    echo ""
}

# 错误处理
handle_error() {
    log_error "部署失败！"
    log_info "正在回滚..."
    
    # 尝试启动旧容器
    $DOCKER_COMPOSE_CMD up -d
    
    exit 1
}

# 主函数
main() {
    log_info "开始部署 IP-Check 项目..."
    echo ""
    
    # 设置错误处理
    trap handle_error ERR
    
    # 执行部署步骤
    check_environment
    sync_code
    setup_env
    stop_old_container
    build_and_start
    
    # 健康检查
    if health_check; then
        show_info
    else
        handle_error
    fi
}

# 运行主函数
main
