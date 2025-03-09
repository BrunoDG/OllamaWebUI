import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from 'ollama'

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

  // Criar uma nova conversa
  const createConversation = (model: string, initialMessage?: Message) => {
    const id = Date.now().toString()
    const now = new Date()
    const newConversation: Conversation = {
      id,
      title: `Conversa ${conversations.value.length + 1}`,
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
  const addMessageToCurrentConversation = (message: Message) => {
    const conversation = getCurrentConversation()
    if (conversation) {
      conversation.messages.push(message)
      conversation.updatedAt = new Date()

      // Atualizar o título baseado na primeira mensagem do usuário
      if (
        message.role === 'user' &&
        conversation.title === `Conversa ${conversations.value.length}`
      ) {
        const content = message.content.substring(0, 30)
        conversation.title = content + (content.length >= 30 ? '...' : '')
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

      // Se a conversa atual foi excluída, mude para outra ou crie uma nova
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
