# Database Coursework - Healthcare Management System

一个使用 Vue 3 + Vite 构建的现代化医疗保健管理系统。

## 功能特性

- 护士、护工和管理员多角色管理
- 病人信息管理
- 医疗记录追踪
- 响应式设计
- 现代化 UI 界面

## 技术栈

- Vue 3
- Vite
- Tailwind CSS
- Vue Router
- Pinia

## 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Docker 部署

项目包含了 Dockerfile 和 nginx 配置，可以直接构建 Docker 镜像：

```bash
docker build -t healthcare-app .
docker run -p 80:80 healthcare-app
```
