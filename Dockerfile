# Imagem base estável e oficial
FROM php:8.2-apache

# Habilitar mod_rewrite do Apache para roteamento
RUN a2enmod rewrite

# Instalar extensões comuns de persistência (PDO MySQL e MySQLi)
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copiar arquivos do projeto para o DocumentRoot padrão do Apache
COPY . /var/www/html/

# Ajustar permissões para o usuário padrão do servidor web
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Porta padrão de escuta
EXPOSE 80

# Iniciar Apache em primeiro plano
CMD ["apache2-foreground"]