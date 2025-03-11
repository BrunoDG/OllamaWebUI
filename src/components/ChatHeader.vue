<template>
  <div class="chat-header">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Bevel Drive Logo" class="logo mr-3" />
        <div>
          <h1 class="text-xl font-bold text-primary">Bolter</h1>
          <span class="text-sm text-color">Modelo: {{ modelName }}</span>
        </div>
      </div>
      <div class="flex items-center">
        <div v-if="conversation" class="text-sm font-medium mr-4 text-color">
          {{ conversation.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModelStore } from '@/stores/model';
import { useConversationStore } from '@/stores/conversation';

const modelStore = useModelStore();
const conversationStore = useConversationStore();

const modelName = computed(() => {
  // Se estiver em uma conversa, use o modelo da conversa
  const currentConversation = conversationStore.getCurrentConversation();
  if (currentConversation) {
    return currentConversation.model;
  }
  // Caso contrário, use o modelo selecionado atualmente
  return modelStore.currentModel;
});

const conversation = computed(() => {
  return conversationStore.getCurrentConversation();
});
</script>

<style scoped>
.chat-header {
  background-color: var(--header-bg-color, #2d2d2d);
  color: var(--text-color);
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #333333);
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.text-color {
  color: var(--text-color);
}
</style>
