#!/bin/sh
set -e

# Definir URL da API Ollama a partir da variável de ambiente ou usar o valor padrão
OLLAMA_API_URL=${OLLAMA_API_URL:-"http://host.docker.internal:11434"}
export OLLAMA_API_URL

# Substituir a URL da API no arquivo de configuração do Nginx
echo "Configurando proxy para API Ollama: $OLLAMA_API_URL"

# Substituir a URL da API no arquivo de configuração do frontend
CONFIG_FILE="/usr/share/nginx/html/config.js"
if [ -f "$CONFIG_FILE" ]; then
    echo "Atualizando configuração do frontend..."
    sed -i "s|http://localhost:11434|$OLLAMA_API_URL|g" $CONFIG_FILE
else
    echo "Criando arquivo de configuração do frontend..."
    echo "window.OLLAMA_API_URL = '$OLLAMA_API_URL';" > $CONFIG_FILE
fi

# Executar o comando fornecido
exec "$@" 