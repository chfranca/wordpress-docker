#!/bin/sh
set -e

if [ -z "$(ls -A /var/www/html)" ]; then
    sh /src/scripts/init-project.sh
fi

sh /src/scripts/update-db-config.sh

sed -i "s/define( 'WP_DEBUG', false )/define( 'WP_DEBUG', $WP_DEBUG )/" /var/www/html/wp-config.php

echo "starting apache..."
apache2-foreground
