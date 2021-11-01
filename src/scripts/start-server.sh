#!/bin/sh
set -e

if [ -z "$(ls -A /var/www/html)" ]; then
    sh /src/scripts/init-project.sh
fi

sh /src/scripts/update-db-config.sh

echo  >> /var/www/html/wp-config.php
echo "define('WP_HOME','$WP_HOME');" >> /var/www/html/wp-config.php
echo "define('WP_SITEURL','$WP_SITEURL');" >> /var/www/html/wp-config.php
echo  >> /var/www/html/wp-config.php

sed -i "s/define( 'WP_DEBUG', false )/define( 'WP_DEBUG', true )/" /var/www/html/wp-config.php

echo "starting apache..."
# /etc/init.d/apache2 start
apache2-foreground
