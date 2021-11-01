#!/bin/sh
set -e

wget -O /src/wordpress.zip \
    --progress=bar:force:noscroll \
    --no-check-certificate \
    https://br.wordpress.org/wordpress-${WP_VERSION}-pt_BR.zip 

echo "unziping downloaded file..."
unzip -q /src/wordpress.zip -d /var/www

mv wordpress/* html

if [ "$(ls -A /src/themes)" ]; then
    echo "removing predefined themes and copy the custom themes"
    # rm -rf /var/www/html/wp-content/themes/
    mv /src/themes/* /var/www/html/wp-content/themes
fi

# if [ "$(ls -A /src/plugins)" ]; then
#     echo "adding custom plugins to wordpress"
#     mv /src/plugins /var/www/wp-content/plugins
# fi

echo "rename wp-config"
mv /var/www/html/wp-config-sample.php /var/www/html/wp-config.php

echo "setting auth keys"
sed -i "/^define( 'AUTH_KEY',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'SECURE_AUTH_KEY',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'LOGGED_IN_KEY',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'NONCE_KEY',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'AUTH_SALT',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'SECURE_AUTH_SALT',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'LOGGED_IN_SALT',\s*'.*' );$/d" /var/www/html/wp-config.php
sed -i "/^define( 'NONCE_SALT',\s*'.*' );$/d" /var/www/html/wp-config.php

curl https://api.wordpress.org/secret-key/1.1/salt/ >> /src/secrets.txt

sed -i '53 r /src/secrets.txt' /var/www/html/wp-config.php

# echo "change user owner to www:data"
# chown -R www-data:www-data /var/www/html