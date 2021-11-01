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

if [ "$(ls -A /src/plugins)" ]; then
    echo "adding custom plugins to wordpress"
    mv /src/plugins /var/www/wp-content/plugins
fi

echo "rename wp-config"
mv /var/www/html/wp-config-sample.php /var/www/html/wp-config.php

echo "setting auth keys"
sed -i "s/^define( 'AUTH_KEY',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'SECURE_AUTH_KEY',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'LOGGED_IN_KEY',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'NONCE_KEY',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'AUTH_SALT',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'SECURE_AUTH_SALT',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'LOGGED_IN_SALT',\s*'.*' );$//" /var/www/html/wp-config.php
sed -i "s/^define( 'NONCE_SALT',\s*'.*' );$//" /var/www/html/wp-config.php

cat > /etc/hosts <<- EOM
127.0.0.1 localhost
EOM

curl https://api.wordpress.org/secret-key/1.1/salt/ >> /var/www/html/wp-config.php

echo "add .htaccess"
cat > /var/www/html/.htaccess <<- EOM
# BEGIN WordPress

RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]

# END WordPress
EOM

echo "change user owner to www:data"
chown -R www-data:www-data /var/www/html