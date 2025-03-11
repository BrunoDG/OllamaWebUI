// Configurações da aplicação
interface Config {
  // URL base da API Ollama
  ollamaBaseUrl: string
}

// Interface para a janela global com a propriedade OLLAMA_API_URL
interface WindowWithOllamaConfig extends Window {
  OLLAMA_API_URL?: string
}

// Obter a URL da API do arquivo de configuração global
const getApiUrl = (): string => {
  // Em ambiente de desenvolvimento, usar o proxy do Vite
  if (import.meta.env.DEV) {
    return '/api'
  }

  // Em produção, usar a URL configurada ou o padrão
  if (typeof window !== 'undefined') {
    const customWindow = window as WindowWithOllamaConfig
    if (customWindow.OLLAMA_API_URL) {
      return customWindow.OLLAMA_API_URL
    }
  }
  return 'http://localhost:11434'
}

// Configuração padrão
const defaultConfig: Config = {
  ollamaBaseUrl: getApiUrl(),
}

// Carregar configuração do localStorage ou usar a padrão
const loadConfig = (): Config => {
  const savedConfig = localStorage.getItem('app_config')
  if (savedConfig) {
    try {
      return { ...defaultConfig, ...JSON.parse(savedConfig) }
    } catch (e) {
      console.error('Erro ao carregar configuração:', e)
    }
  }
  return defaultConfig
}

// Salvar configuração no localStorage
export const saveConfig = (config: Partial<Config>): Config => {
  const currentConfig = loadConfig()
  const newConfig = { ...currentConfig, ...config }
  localStorage.setItem('app_config', JSON.stringify(newConfig))
  return newConfig
}

// Exportar a configuração atual
export const config = loadConfig()
