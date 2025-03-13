import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from 'ollama'
import { config } from '@/config'

interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: Date
  updatedAt: Date
}

interface ConversationJSON {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: string
  updatedAt: string
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)

  // Limpar tags think do conteúdo
  const cleanThinkTags = (content: string): string => {
    return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  }

  // Gerar título usando o modelo
  const generateTitle = async (conversation: Conversation) => {
    try {
      // Limpar as tags think das mensagens
      const cleanMessages = conversation.messages.map((m) => ({
        ...m,
        content: cleanThinkTags(m.content),
      }))

      const prompt = `Com base na conversa a seguir, gere um título curto e descritivo (máximo 50 caracteres):

${cleanMessages.map((m) => `${m.role}: ${m.content}`).join('\n')}

Responda APENAS com o título, sem explicações adicionais.`

      const response = await fetch(`${config.ollamaBaseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: conversation.model,
          prompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar título')
      }

      const data = await response.json()
      // Limpar tags think da resposta e remover quebras de linha
      const newTitle = cleanThinkTags(data.response).replace(/\n/g, ' ').trim()

      // Atualizar o título da conversa
      conversation.title = newTitle
      saveToLocalStorage()

      return newTitle
    } catch (error) {
      console.error('Erro ao gerar título:', error)
      return null
    }
  }

  // Criar uma nova conversa
  const createConversation = (model: string, initialMessage?: Message) => {
    const id = Date.now().toString()
    const now = new Date()
    const newConversation: Conversation = {
      id,
      title: `Nova Conversa`,
      messages: initialMessage ? [initialMessage] : [],
      model,
      createdAt: now,
      updatedAt: now,
    }

    conversations.value.push(newConversation)
    currentConversationId.value = id
    saveToLocalStorage()
    return id
  }

  // Obter a conversa atual
  const getCurrentConversation = () => {
    if (!currentConversationId.value) return null
    return conversations.value.find((c) => c.id === currentConversationId.value) || null
  }

  // Adicionar mensagem à conversa atual
  const addMessageToCurrentConversation = async (message: Message) => {
    const conversation = getCurrentConversation()
    if (conversation) {
      conversation.messages.push(message)
      conversation.updatedAt = new Date()

      // Se for a primeira mensagem do usuário, gerar título
      if (message.role === 'user' && conversation.messages.length <= 2) {
        generateTitle(conversation)
      }

      saveToLocalStorage()
    }
  }

  // Mudar para outra conversa
  const switchConversation = (id: string) => {
    const exists = conversations.value.some((c) => c.id === id)
    if (exists) {
      currentConversationId.value = id
      return true
    }
    return false
  }

  // Excluir uma conversa
  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)

      if (currentConversationId.value === id) {
        if (conversations.value.length > 0) {
          currentConversationId.value = conversations.value[0].id
        } else {
          currentConversationId.value = null
        }
      }

      saveToLocalStorage()
      return true
    }
    return false
  }

  // Renomear uma conversa
  const renameConversation = (id: string, newTitle: string) => {
    const conversation = conversations.value.find((c) => c.id === id)
    if (conversation) {
      conversation.title = newTitle
      saveToLocalStorage()
      return true
    }
    return false
  }

  // Salvar no localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
    localStorage.setItem('currentConversationId', currentConversationId.value || '')
  }

  // Carregar do localStorage
  const loadFromLocalStorage = () => {
    const savedConversations = localStorage.getItem('conversations')
    const savedCurrentId = localStorage.getItem('currentConversationId')

    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations) as ConversationJSON[]
        conversations.value = parsed.map((conv) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }))
      } catch (e) {
        console.error('Erro ao carregar conversas:', e)
      }
    }

    if (savedCurrentId) {
      currentConversationId.value = savedCurrentId
    }
  }

  // Carregar as conversas ao inicializar
  loadFromLocalStorage()

  return {
    conversations,
    currentConversationId,
    createConversation,
    getCurrentConversation,
    addMessageToCurrentConversation,
    switchConversation,
    deleteConversation,
    renameConversation,
  }
})
