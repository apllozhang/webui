# ALE WebUI Design Spec v5.1 — static site on nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY fonts-compare.html /usr/share/nginx/html/fonts-compare.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY fonts /usr/share/nginx/html/fonts
COPY assets /usr/share/nginx/html/assets

EXPOSE 80

# 官方法律声明（规范 2.2/D.4）
LABEL org.opencontainers.image.title="ALE WebUI Design Spec" \
      org.opencontainers.image.description="ALE WebUI v5.1 spec site" \
      org.opencontainers.image.vendor="ALE International"
