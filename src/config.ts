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
    return '/api'
  }
  // Em produção, use a URL configurada ou o padrão
  return (window as CustomWindow).OLLAMA_API_URL || 'http://localhost:11434'
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
