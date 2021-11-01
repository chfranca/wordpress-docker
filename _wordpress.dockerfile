FROM php:8-apache-buster

COPY .docker/scripts /src
COPY src /src
COPY wordpress /var/www

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ADD .docker/php/php.ini /usr/local/etc/php/conf.d/php.ini
ADD .docker/apache/apache.conf /etc/apache2/sites-available/000-default.conf

RUN docker-php-ext-install pdo pdo_mysql mysqli 
RUN a2enmod rewrite

EXPOSE 80
WORKDIR /var/www

ENTRYPOINT ["/src/scripts/start-server.sh"]