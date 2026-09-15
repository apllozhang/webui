# ALE WebUI Design Spec v6.0 — static site on nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY fonts-compare.html /usr/share/nginx/html/fonts-compare.html
# 版本真源:徽章/VER 门禁运行时读取,必须进容器(F1 类双层清单坑第二次——tar 与 COPY 都要列)
COPY design-system.version.json /usr/share/nginx/html/design-system.version.json
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY fonts /usr/share/nginx/html/fonts
COPY assets /usr/share/nginx/html/assets

EXPOSE 80

# 官方法律声明（规范 2.2/D.4）
LABEL org.opencontainers.image.title="ALE WebUI Design Spec" \
      org.opencontainers.image.description="ALE WebUI v6.0 spec site" \
      org.opencontainers.image.vendor="ALE International"
