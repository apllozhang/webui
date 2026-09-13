# ALE WebUI Kit — hub + 三骨架（react/alpine/static 子路径）
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY hub /usr/share/nginx/html/hub
COPY react /usr/share/nginx/html/react
COPY alpine /usr/share/nginx/html/alpine
COPY static /usr/share/nginx/html/static

# nginx root 指向 hub 的内容平铺到站点根
RUN cp -r /usr/share/nginx/html/hub/. /usr/share/nginx/html/ && rm -rf /usr/share/nginx/html/hub

EXPOSE 80

LABEL org.opencontainers.image.title="ALE WebUI Kit" \
      org.opencontainers.image.description="ALE WebUI v5.1 spec skeletons: react / alpine / static" \
      org.opencontainers.image.vendor="ALE International"
