#!/bin/sh
set -e

echo "setting db config in wp-config"
sed -i \
    "s/^define( 'DB_NAME', '.*' );$/define( 'DB_NAME', '$WP_DBNAME' );/" \
    /var/www/html/wp-config.php

sed -i \
    "s/^define( 'DB_USER', '.*' );$/define( 'DB_USER', '$WP_DBUSER' );/" \
    /var/www/html/wp-config.php

sed -i \
    "s/^define( 'DB_PASSWORD', '.*' );$/define( 'DB_PASSWORD', '$WP_DBPASS' );/" \
    /var/www/html/wp-config.php

sed -i \
    "s/^define( 'DB_HOST', '.*' );$/define( 'DB_HOST', '$WP_DBHOST' );/" \
    /var/www/html/wp-config.php

sed -i \
    "s/^\$table_prefix = 'wp_';$/\$table_prefix = '$WP_PREFIX';/" \
    /var/www/html/wp-config.php