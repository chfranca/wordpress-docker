FROM nginx:stable-alpine

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY .docker/nginx/nginx.conf /etc/nginx/
COPY .docker/nginx/default.conf /etc/nginx/conf.d/

COPY ./wordpress/ /var/www

EXPOSE 80