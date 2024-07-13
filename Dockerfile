#FROM nginx:latest
#
#
#COPY ./dist /etc/nginx/html
#
## 设置环境变量
#ENV UMI_APP_TARGET=production
#ENV UMI_APP_TARGET_A=production
#
#COPY nginx.prod.conf /etc/nginx/nginx.conf
#EXPOSE 80
#EXPOSE 443
# 使用 Node.js 作为构建阶段
FROM node:14 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 或 yarn.lock 文件
COPY package*.json ./
# 如果使用 Yarn，取消下面这一行的注释
# COPY yarn.lock ./

# 安装依赖
RUN npm install
# 如果使用 Yarn，取消下面这一行的注释
# RUN yarn install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build
# 如果使用 Yarn，取消下面这一行的注释
# RUN yarn build

# 使用 Nginx 作为生产环境
FROM nginx:alpine

# 如果是 Create React App，构建输出目录是 /app/build
# 如果是 Vue CLI，构建输出目录是 /app/dist

# 复制构建输出到 Nginx 的 html 文件夹
#COPY --from=build /app/build /usr/share/nginx/html
# 如果是 Vue CLI，取消上面一行并使用下面一行
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件，如果有的话
COPY nginx.prod.conf /etc/nginx/nginx.conf

# 设置环境变量
ENV UMI_APP_TARGET=production
ENV UMI_APP_TARGET_A=production

# 暴露端口
EXPOSE 80

## 启动 Nginx
#CMD ["nginx", "-g", "daemon off;"]
