FROM mariadb:10.6.4

COPY .docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf

RUN mkdir /data
COPY ./.docker/mysql/init/init.sql /data/init.sql

EXPOSE 3306