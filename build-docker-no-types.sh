#!/bin/bash

# Script para construir a imagem Docker do Bolter UI sem verificação de tipos

echo "=== Construindo a imagem Docker do Bolter UI (sem verificação de tipos) ==="
docker build -t bolter-ui:latest .

if [ $? -eq 0 ]; then
  echo "=== Imagem construída com sucesso! ==="
  echo "Para executar a imagem, use:"
  echo "docker-compose up -d"
  
  # Perguntar se deseja executar o docker-compose
  read -p "Deseja executar o docker-compose agora? (s/n): " resposta
  if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
    echo "=== Iniciando os contêineres com Docker Compose ==="
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
      echo "=== Bolter UI está rodando! ==="
      echo "Acesse: http://localhost:8080"
    else
      echo "=== Erro ao iniciar os contêineres ==="
    fi
  fi
else
  echo "=== Erro ao construir a imagem Docker ==="
fi 