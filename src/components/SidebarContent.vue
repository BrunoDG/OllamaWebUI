<template>
  <div class="sidebar-content flex flex-col h-full">
    <!-- Seletor de modelo -->
    <div class="p-4 border-b border-gray-200">
      <ModelSelect />
    </div>

    <!-- Histórico de conversas -->
    <div class="flex-grow overflow-hidden">
      <ConversationHistory @conversation-changed="handleConversationChanged" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModelSelect from './ModelSelect.vue';
import ConversationHistory from './ConversationHistory.vue';

// Definir eventos emitidos
const emit = defineEmits<{
  (e: 'conversation-changed'): void
}>();

// Função para repassar o evento
const handleConversationChanged = () => {
  emit('conversation-changed');
};
</script>

<style scoped>
.sidebar-content {
  height: 100%;
  background-color: var(--sidebar-bg-color);
}
</style>
