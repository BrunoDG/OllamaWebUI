<template>
  <div class="chat-header">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Bevel Drive Logo" class="logo mr-3" />
        <div>
          <h1 class="text-xl font-bold text-primary">Bolter</h1>
          <span class="text-sm">Modelo: {{ modelName }}</span>
        </div>
      </div>
      <div class="flex items-center">
        <div v-if="conversation" class="text-sm font-medium mr-4">
          {{ conversation.title }}
        </div>
        <Button icon="pi pi-sun" v-if="isDarkTheme" rounded text class="text-white" aria-label="Mudar para tema claro"
          @click="toggleTheme" v-tooltip.bottom="'Mudar para tema claro'" />
        <Button icon="pi pi-moon" v-else rounded text class="text-primary" aria-label="Mudar para tema escuro"
          @click="toggleTheme" v-tooltip.bottom="'Mudar para tema escuro'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModelStore } from '@/stores/model';
import { useConversationStore } from '@/stores/conversation';
import { isDarkTheme, toggleTheme } from '@/main';

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
  color: white;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #333333);
  transition: background-color 0.3s, border-color 0.3s;
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>
