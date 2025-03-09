# Estágio de build
FROM node:20-alpine as build-stage

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código-fonte
COPY . .

# Construir o aplicativo para produção
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine as production-stage

# Copiar arquivos de build para o nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Adicionar script de inicialização
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Definir comando de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"] 