# Bolter - Interface Web para Ollama

Bolter é uma interface web moderna e elegante para o Ollama, permitindo interagir com modelos de linguagem de forma fácil e intuitiva.

## Características

- Interface de usuário moderna com tema escuro
- Suporte a markdown nas mensagens
- Histórico de conversas
- Seleção de modelos
- Barra lateral colapsável
- Configuração de conexão com Ollama remoto

## Instalação no CasaOS

### Método 1: Usando o Docker Compose

1. Faça o download do repositório:

   ```bash
   git clone https://github.com/brunodg/OllamaWebUI.git
   cd OllamaWebUI
   ```

2. Construa a imagem Docker localmente:

   ```bash
   docker build -t bolter-ui:latest .
   ```

3. Execute o Docker Compose:

   ```bash
   docker-compose up -d
   ```

4. Acesse a interface web em `http://seu-servidor:8080`

### Método 2: Usando a interface do CasaOS

Para usar a interface do CasaOS, você precisa primeiro construir a imagem Docker localmente no servidor CasaOS:

1. Transfira os arquivos do projeto para o servidor CasaOS (usando SCP, SFTP, Git, etc.)
2. Conecte-se via SSH ao servidor CasaOS
3. Navegue até a pasta do projeto
4. Construa a imagem localmente:

   ```bash
   docker build -t bolter-ui:latest .
   ```

5. Acesse o painel do CasaOS
6. Vá para "Aplicativos" > "Instalar"
7. Clique em "Personalizado"
8. Cole o seguinte conteúdo:

```yaml
version: '3'
services:
  bolter-ui:
    image: bolter-ui:latest
    container_name: bolter-ui
    ports:
      - '8080:80'
    environment:
      - OLLAMA_API_URL=http://ollama:11434
    networks:
      - ollama-network
    restart: unless-stopped
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ollama-data:/root/.ollama
    ports:
      - '11434:11434'
    networks:
      - ollama-network
    restart: unless-stopped

networks:
  ollama-network:
    driver: bridge

volumes:
  ollama-data:
    driver: local
```

9. Clique em "Instalar"
10. Acesse a interface web em `http://seu-servidor:8080`

### Método 3: Publicando a imagem no Docker Hub (opcional)

Se você quiser disponibilizar sua imagem para outros usuários ou para facilitar a instalação em múltiplos servidores:

1. Crie uma conta no Docker Hub (<https://hub.docker.com/>)
2. Faça login no Docker Hub localmente:

   ```bash
   docker login
   ```

3. Construa a imagem com seu nome de usuário:

   ```bash
   docker build -t seunomeusuario/bolter-ui:latest .
   ```

4. Envie a imagem para o Docker Hub:

   ```bash
   docker push seunomeusuario/bolter-ui:latest
   ```

5. Modifique o docker-compose.yml para usar sua imagem publicada:

   ```yaml
   services:
     bolter-ui:
       image: seunomeusuario/bolter-ui:latest
       # resto do arquivo...
   ```

## Configuração

### Conexão com Ollama em outro servidor

Se você deseja conectar o Bolter a uma instância do Ollama em outro servidor:

1. Acesse a aba "Conexão" na barra lateral
2. Digite o URL do servidor Ollama (ex: `http://192.168.1.8:11434`)
3. Clique em "Testar Conexão" e depois em "Salvar"

### Personalização do tema

1. Acesse a aba "Tema" na barra lateral
2. Escolha uma cor predefinida ou digite um código de cor hexadecimal
3. Clique em "Aplicar Tema"

## Desenvolvimento

### Requisitos

- Node.js 18+
- npm ou yarn

### Instalação para desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

## Licença

MIT
