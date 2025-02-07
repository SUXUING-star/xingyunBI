# bi-app/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码和配置文件
COPY . .

# 构建项目
RUN npm run build

# Nginx 配置
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf