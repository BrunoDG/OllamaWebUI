# Bolter - Interface Web para Ollama

Interface web moderna e intuitiva para interagir com o Ollama, permitindo conversas com modelos de IA de forma fácil e eficiente.

## Características

- Interface moderna com tema escuro
- Suporte a Markdown e realce de sintaxe
- Histórico de conversas
- Seleção de modelos
- Barra lateral colapsável
- Configuração para conexão com Ollama em outro servidor

## Instalação

### Usando Docker Compose

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/bolter-ui.git
   cd bolter-ui
   ```

2. Inicie o container:

   ```bash
   docker-compose up -d
   ```

3. Acesse <http://localhost:8080>

### Usando CasaOS

1. Abra a interface do CasaOS
2. Vá para a seção "App Store"
3. Procure por "Bolter UI"
4. Clique em "Instalar"
5. Configure a porta desejada (padrão: 8080)
6. Clique em "Instalar" novamente

## Configuração

### Conexão com Ollama em outro servidor

Se você deseja conectar o Bolter a uma instância do Ollama em outro servidor:

1. Acesse a aba "Conexão" na barra lateral
2. Digite o URL do servidor Ollama (ex: `http://192.168.1.8:11434`)
3. Clique em "Testar Conexão" e depois em "Salvar"

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

### Construindo a imagem Docker

1. Certifique-se de ter o Docker instalado e estar logado no Docker Hub:

   ```bash
   docker login
   ```

2. Construa a imagem com seu nome de usuário:

   ```bash
   docker build -t seunomeusuario/bolter-ui:latest .
   ```

3. Envie a imagem para o Docker Hub:

   ```bash
   docker push seunomeusuario/bolter-ui:latest
   ```

4. Modifique o docker-compose.yml para usar sua imagem publicada:

   ```yaml
   services:
     bolter-ui:
       image: seunomeusuario/bolter-ui:latest
       # resto do arquivo...
   ```

## Licença

MIT
