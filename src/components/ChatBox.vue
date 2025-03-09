<template>
  <div id="chat-box" class="flex flex-col h-full">
    <div id="chat-container" class="relative w-full h-[calc(100%-100px)]">
      <div id="chat-area" ref="chatAreaRef" class="absolute overflow-y-auto inset-0">
        <div v-for="message in messages" :key="message.content">
          <ChatMessage :message="message" aria-placeholder="Digite sua mensagem aqui..." />
        </div>
        <div v-if="currentOutputMsgContent">
          <ChatMessage :message="{ role: 'agent', content: currentOutputMsgContent }" />
        </div>
      </div>
    </div>
    <div id="chat-input" ref="chatInputRef" class="flex flex-col h-[100px] w-full">
      <div class="flex h-full p-[10px] items-center justify-between">
        <Textarea id="chatInput" v-model="chatInput" @keyup.enter="submitChat"
          placeholder="Digite sua mensagem aqui... (suporta markdown)"
          class="w-[calc(100%-82px)] h-full p-[10px] mr-2" />
        <Button id="submitChat" @click="submitChat" class="h-full flex items-center justify-center w-20"
          aria-label="Enviar mensagem">
          <i class="pi pi-send text-xl"></i>
        </Button>
      </div>
      <div class="text-xs text-gray-500 px-[10px] -mt-2 flex items-center">
        <i class="pi pi-info-circle mr-1"></i>
        <span>Dica: Você pode usar **negrito**, *itálico*, `código`, ```blocos de código```, [links](url) e muito
          mais!</span>
        <Button icon="pi pi-question" text class="p-0 ml-1"
          v-tooltip.top="'Markdown suportado: **negrito**, *itálico*, `código`, ```blocos de código```, # Títulos, > Citações, - Listas, [links](url), etc.'"></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue';
import ollama from 'ollama';
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);

const chatInput = ref('');
const messages = ref([{ role: 'agent', content: 'Olá! Eu sou o Bolter. Como posso ajudar você hoje?' }]);
const currentOutputMsgContent = ref('');
const chatAreaRef = ref(null);

// Função para rolar para o final da conversa
const scrollToBottom = () => {
  if (chatAreaRef.value) {
    setTimeout(() => {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight;
    }, 50);
  }
};

onMounted(() => {
  scrollToBottom();
});

const submitChat = async () => {
  if (!chatInput.value.trim()) return;

  console.log("Conversando com o modelo: ", currentModel.value);
  const content = chatInput.value;
  chatInput.value = '';
  const inputMsg = { role: 'user', content };
  messages.value.push(inputMsg);
  scrollToBottom();

  try {
    const response = await ollama.chat({
      model: currentModel.value,
      messages: [inputMsg],
      stream: true,
    });

    currentOutputMsgContent.value = '';
    for await (const part of response) {
      currentOutputMsgContent.value += part.message.content;
      scrollToBottom();
    }
    messages.value.push({ role: 'agent', content: currentOutputMsgContent.value });
    currentOutputMsgContent.value = '';
    scrollToBottom();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    messages.value.push({
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
}
</style>
