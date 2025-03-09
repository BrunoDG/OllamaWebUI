#!/bin/bash

# Script para construir e executar o Bolter UI

echo "=== Construindo a imagem Docker do Bolter UI ==="
docker build -t bolter-ui:latest .

if [ $? -eq 0 ]; then
  echo "=== Imagem construída com sucesso! ==="
  
  echo "=== Iniciando os contêineres com Docker Compose ==="
  docker-compose up -d
  
  if [ $? -eq 0 ]; then
    echo "=== Bolter UI está rodando! ==="
    echo "Acesse: http://localhost:8080"
  else
    echo "=== Erro ao iniciar os contêineres ==="
  fi
else
  echo "=== Erro ao construir a imagem Docker ==="
fi 