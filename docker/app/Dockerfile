FROM php:7.3-apache

RUN apt-get update && apt-get install -y \
    gnupg git zlib1g-dev libpng-dev libicu-dev libjpeg-dev libffi-dev wget zip \
    libzip-dev libzip4 \
    multiarch-support \
    libxml2-dev libfreetype6 libfreetype6-dev g++ make autoconf \
    build-essential libfontconfig1-dev libssl-dev libx11-dev libxext-dev libxrender-dev python libpq-dev \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && pecl install xdebug \
    && pecl install redis \
    && docker-php-ext-enable redis xdebug \
    && docker-php-ext-install pdo_mysql pdo_pgsql pgsql intl zip gd pcntl bcmath calendar \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install -y nodejs

RUN a2enmod rewrite

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY php.ini /usr/local/etc/php/

ARG XDEBUG_REMOTE_ENABLE
ARG XDEBUG_REMOTE_HOST
ARG XDEBUG_REMOTE_AUTO_START
ARG XDEBUG_REMOTE_CONNECT_BACK
ARG XDEBUG_IDEKEY

RUN echo "[xdebug]" > /usr/local/etc/php/conf.d/xdebug-dev.ini
RUN echo "xdebug.remote_enable=${XDEBUG_REMOTE_ENABLE}" >> /usr/local/etc/php/conf.d/xdebug-dev.ini
RUN echo "xdebug.remote_host=${XDEBUG_REMOTE_HOST}" >> /usr/local/etc/php/conf.d/xdebug-dev.ini
RUN echo "xdebug.remote_autostart=${XDEBUG_REMOTE_AUTO_START}" >> /usr/local/etc/php/conf.d/xdebug-dev.ini
RUN echo "xdebug.remote_connect_back=${XDEBUG_REMOTE_CONNECT_BACK}" >> /usr/local/etc/php/conf.d/xdebug-dev.ini
RUN echo "xdebug.idekey=${XDEBUG_IDEKEY}" >> /usr/local/etc/php/conf.d/xdebug-dev.ini

WORKDIR /var/www/html

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
