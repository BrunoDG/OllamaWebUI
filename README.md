# Bolter - Interface Web para Ollama

Bolter é uma interface web moderna e elegante para o Ollama, permitindo interagir com modelos de linguagem de forma fácil e intuitiva.

## Características

- Interface de usuário moderna com tema escuro/claro
- Suporte a markdown nas mensagens
- Histórico de conversas
- Seleção de modelos
- Barra lateral colapsável
- Configuração de conexão com Ollama remoto

## Instalação no CasaOS

### Método 1: Usando o Docker Compose

1. Faça o download do repositório:

   ```bash
   git clone https://github.com/seu-usuario/bolter.git
   cd bolter
   ```

2. Execute o Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Acesse a interface web em `http://seu-servidor:8080`

### Método 2: Usando a interface do CasaOS

1. Acesse o painel do CasaOS
2. Vá para "Aplicativos" > "Instalar"
3. Clique em "Personalizado"
4. Cole o seguinte conteúdo:

```yaml
version: '3'
services:
  bolter-ui:
    image: seu-usuario/bolter-ui:latest
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

5. Clique em "Instalar"
6. Acesse a interface web em `http://seu-servidor:8080`

## Configuração

### Conexão com Ollama em outro servidor

Se você deseja conectar o Bolter a uma instância do Ollama em outro servidor:

1. Acesse a aba "Conexão" na barra lateral
2. Digite o URL do servidor Ollama (ex: `http://192.168.1.100:11434`)
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

## Construção da imagem Docker

```bash
docker build -t seu-usuario/bolter-ui:latest .
```

## Licença

MIT
