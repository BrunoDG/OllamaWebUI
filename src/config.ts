// Configurações da aplicação
interface Config {
  // URL base da API Ollama
  ollamaBaseUrl: string
}

// Interface para a janela global com a propriedade OLLAMA_API_URL
interface CustomWindow extends Window {
  OLLAMA_API_URL?: string
}

// Obter a URL da API do arquivo de configuração global
function getApiUrl(): string {
  // Em desenvolvimento, use o proxy do Vite
  if (import.meta.env.DEV) {
    // Usar sempre o proxy em desenvolvimento, mesmo para acessos externos
    console.log('Usando proxy do Vite para a API')
    return '/api'
  }

  // Em produção, use a URL configurada ou o padrão
  const configuredUrl = (window as CustomWindow).OLLAMA_API_URL
  console.log('URL da API em produção:', configuredUrl || 'http://localhost:11434')
  return configuredUrl || 'http://localhost:11434'
}

// Configuração padrão
const defaultConfig: Config = {
  ollamaBaseUrl: getApiUrl(),
}

// Carregar configuração do localStorage
const loadConfig = (): Config => {
  const savedConfig = localStorage.getItem('config')
  if (savedConfig) {
    return JSON.parse(savedConfig)
  }
  return defaultConfig
}

// Salvar configuração no localStorage
const saveConfig = (config: Config) => {
  localStorage.setItem('config', JSON.stringify(config))
}

// Exportar a configuração atual
export const config = loadConfig()
export { saveConfig }
