FROM php:8.4.3-apache

RUN docker-php-ext-install pdo_mysql

RUN a2enmod rewrite

COPY ./src /var/www/html
COPY php.ini /usr/local/etc/php/php.ini