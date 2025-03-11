<template>
  <div id="chat-box" class="flex flex-col h-full">
    <!-- Cabeçalho fixo -->
    <ChatHeader />

    <div id="chat-container" class="relative w-full h-[calc(100%-160px)]">
      <div id="chat-area" ref="chatAreaRef" class="absolute overflow-y-auto inset-0">
        <div v-if="!currentConversation" class="flex items-center justify-center h-full">
          <div class="text-center p-4">
            <h2 class="text-xl font-bold mb-2">Bem-vindo ao Bolter!</h2>
            <p class="mb-4">Inicie uma nova conversa para começar a interagir com o modelo.</p>
            <Button label="Nova Conversa" icon="pi pi-plus" @click="createNewConversation" />
          </div>
        </div>
        <template v-else>
          <div v-for="message in currentConversation.messages" :key="message.content">
            <ChatMessage :message="message" aria-placeholder="Digite sua mensagem aqui..." />
          </div>
          <div v-if="currentOutputMsgContent">
            <ChatMessage :message="{ role: 'agent', content: currentOutputMsgContent }" />
          </div>
        </template>
      </div>
    </div>
    <div id="chat-input" ref="chatInputRef" class="flex flex-col h-[100px] w-full" v-if="currentConversation">
      <div class="flex h-full p-[10px] items-center justify-between">
        <Textarea id="chatInput" v-model="chatInput" @keyup.enter="submitChat"
          placeholder="Digite sua mensagem aqui... (suporta markdown)"
          class="w-[calc(100%-82px)] h-full p-[10px] mr-2" />
        <Button id="submitChat" @click="submitChat" class="h-full flex items-center justify-center w-20"
          aria-label="Enviar mensagem">
          <i class="pi pi-send text-xl"></i>
        </Button>
      </div>
      <div class="text-xs text-secondary px-[10px] -mt-2 flex items-center">
        <i class="pi pi-info-circle mr-1"></i>
        <span>Dica: Você pode usar **negrito**, *itálico*, `código`, ```blocos de código```, [links](url) e muito
          mais!</span>
        <Button icon="pi pi-question" text class="p-0 ml-1"
          v-tooltip.top="'Markdown suportado: **negrito**, *itálico**, `código`, ```blocos de código```, # Títulos, > Citações, - Listas, [links](url), etc.'"></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, computed } from 'vue';
import { useModelStore } from '@/stores/model';
import { useConversationStore } from '@/stores/conversation';
import { config } from '@/config';
import ChatHeader from './ChatHeader.vue';

const modelStore = useModelStore();
const conversationStore = useConversationStore();
const { currentModel } = toRefs(modelStore);

const chatInput = ref('');
const currentOutputMsgContent = ref('');
const chatAreaRef = ref(null);

// Obter a conversa atual
const currentConversation = computed(() => {
  return conversationStore.getCurrentConversation();
});

// Criar uma nova conversa
const createNewConversation = () => {
  const initialMessage = {
    role: 'agent' as const,
    content: `Olá! Eu sou o Bolter e estou usando o modelo ${currentModel.value}. Como posso ajudar você hoje?`
  };
  conversationStore.createConversation(currentModel.value, initialMessage);
  scrollToBottom();
};

// Função para rolar para o final da conversa
const scrollToBottom = () => {
  if (chatAreaRef.value) {
    setTimeout(() => {
      if (chatAreaRef.value) {
        chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight;
      }
    }, 50);
  }
};

onMounted(() => {
  // Se não houver conversa atual, criar uma nova
  if (!currentConversation.value) {
    createNewConversation();
  }
  scrollToBottom();
});

const submitChat = async () => {
  if (!chatInput.value.trim() || !currentConversation.value) return;

  console.log("Conversando com o modelo: ", currentModel.value);
  const content = chatInput.value;
  chatInput.value = '';
  const inputMsg = { role: 'user', content };

  // Adicionar mensagem do usuário à conversa
  conversationStore.addMessageToCurrentConversation(inputMsg);
  scrollToBottom();

  try {
    // Usar a URL configurada para a API Ollama
    const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: currentModel.value,
        messages: [inputMsg],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Não foi possível ler a resposta');
    }

    currentOutputMsgContent.value = '';

    // Processar a resposta em streaming
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decodificar o chunk de dados
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          if (line === 'data: [DONE]') continue;

          const data = JSON.parse(line.replace(/^data: /, ''));
          if (data.message?.content) {
            currentOutputMsgContent.value += data.message.content;
            scrollToBottom();
          }
        } catch (e) {
          console.error('Erro ao processar chunk:', e);
        }
      }
    }

    // Adicionar resposta do modelo à conversa
    conversationStore.addMessageToCurrentConversation({
      role: 'agent',
      content: currentOutputMsgContent.value
    });

    currentOutputMsgContent.value = '';
    scrollToBottom();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    conversationStore.addMessageToCurrentConversation({
      role: 'agent',
      content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
    });
    scrollToBottom();
  }
};
</script>

<style scoped>
#chat-area {
  scroll-behavior: smooth;
  background-color: var(--chat-bg-color);
  color: var(--text-color);
}

#chat-box {
  background-color: var(--chat-bg-color);
  color: var(--text-color);
}

#chat-container {
  background-color: var(--chat-bg-color);
}

/* Estilo específico para o Textarea */
:deep(.p-inputtextarea) {
  background-color: var(--input-bg-color) !important;
  color: var(--input-text-color) !important;
  border-color: var(--input-border-color) !important;
}

.text-secondary {
  color: var(--text-secondary-color, #888888);
}
</style>
