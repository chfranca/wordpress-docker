FROM mariadb:10.6.4

COPY .docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf

RUN mkdir /data

EXPOSE 3306