FROM php:8.2-apache

# 1. Install ekstensi pdo_mysql untuk koneksi ke database MySQL
RUN docker-php-ext-install pdo_mysql

# 2. Aktifkan modul rewrite Apache untuk mendukung .htaccess
RUN a2enmod rewrite

# 3. Set working directory
WORKDIR /var/www/html

# 4. Salin isi folder backend ke container
COPY . .

# 5. Beri izin akses ke folder (penting di Linux agar tidak error permission)
RUN chown -R www-data:www-data /var/www/html
