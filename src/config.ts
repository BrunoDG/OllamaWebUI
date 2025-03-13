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
  // Em desenvolvimento, sempre use o proxy local
  if (import.meta.env.DEV) {
    console.log('Usando proxy local para a API')
    // Usar o caminho relativo para garantir que as requisições passem pelo proxy do Vite
    return window.location.origin + '/api'
  }

  // Em produção, use a URL configurada ou o padrão
  let configuredUrl = (window as CustomWindow).OLLAMA_API_URL || 'http://localhost:11434'

  // Garantir que estamos usando HTTP, não HTTPS
  if (configuredUrl.startsWith('https://')) {
    console.warn('URL configurada usa HTTPS. Mudando para HTTP.')
    configuredUrl = configuredUrl.replace('https://', 'http://')
  }

  console.log('URL da API em produção:', configuredUrl)
  return configuredUrl
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
