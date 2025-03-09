<template>
  <div class="conversation-history flex flex-col h-full">
    <div class="flex justify-between items-center p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold">Histórico de Conversas</h2>
      <Button icon="pi pi-plus" rounded text class="text-white" aria-label="Nova Conversa"
        @click="createNewConversation" />
    </div>

    <div class="overflow-y-auto flex-grow">
      <div v-if="conversations.length === 0" class="p-4 text-center text-gray-400">
        Nenhuma conversa encontrada. Inicie uma nova conversa!
      </div>

      <div v-for="conversation in conversations" :key="conversation.id" :class="['conversation-item p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800',
        { 'bg-gray-800': conversation.id === currentConversationId }]" @click="switchToConversation(conversation.id)">
        <div class="flex justify-between items-center">
          <div class="flex-grow truncate pr-2">
            <div class="font-medium">{{ conversation.title }}</div>
            <div class="text-xs text-gray-400">
              {{ formatDate(conversation.updatedAt) }} • {{ conversation.model }}
            </div>
          </div>
          <div class="flex">
            <Button icon="pi pi-pencil" text rounded size="small" class="text-white"
              @click.stop="startRenaming(conversation)" aria-label="Renomear" />
            <Button icon="pi pi-trash" text rounded severity="danger" size="small"
              @click.stop="confirmDelete(conversation.id)" aria-label="Excluir" />
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo de renomeação -->
    <Dialog v-model:visible="renamingDialogVisible" header="Renomear Conversa" :style="{ width: '30rem' }">
      <div class="flex flex-column gap-2">
        <InputText v-model="newTitle" placeholder="Novo título" class="w-full" />
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="renamingDialogVisible = false" />
        <Button label="Salvar" icon="pi pi-check" @click="renameConversation" autofocus />
      </template>
    </Dialog>

    <!-- Diálogo de confirmação de exclusão -->
    <Dialog v-model:visible="deleteDialogVisible" header="Confirmar Exclusão" :style="{ width: '30rem' }">
      <div class="flex flex-column gap-2">
        <p>Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.</p>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialogVisible = false" />
        <Button label="Excluir" icon="pi pi-trash" severity="danger" @click="deleteConversation" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConversationStore } from '@/stores/conversation';
import { useModelStore } from '@/stores/model';

const conversationStore = useConversationStore();
const modelStore = useModelStore();

const conversations = computed(() => {
  // Ordenar por data de atualização (mais recente primeiro)
  return [...conversationStore.conversations].sort((a, b) =>
    b.updatedAt.getTime() - a.updatedAt.getTime()
  );
});

const currentConversationId = computed(() => conversationStore.currentConversationId);

// Formatação de data
const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Hoje ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Ontem ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString();
  }
};

// Criar nova conversa
const createNewConversation = () => {
  const initialMessage = {
    role: 'agent' as const,
    content: `Olá! Eu sou o Bolter e estou usando o modelo ${modelStore.currentModel}. Como posso ajudar você hoje?`
  };
  conversationStore.createConversation(modelStore.currentModel, initialMessage);

  // Emitir evento para notificar o componente pai
  emit('conversation-changed');
};

// Mudar para outra conversa
const switchToConversation = (id: string) => {
  conversationStore.switchConversation(id);

  // Emitir evento para notificar o componente pai
  emit('conversation-changed');
};

// Renomeação de conversa
const renamingDialogVisible = ref(false);
const conversationToRename = ref<{ id: string, title: string } | null>(null);
const newTitle = ref('');

const startRenaming = (conversation: { id: string, title: string }) => {
  conversationToRename.value = conversation;
  newTitle.value = conversation.title;
  renamingDialogVisible.value = true;
};

const renameConversation = () => {
  if (conversationToRename.value && newTitle.value.trim()) {
    conversationStore.renameConversation(conversationToRename.value.id, newTitle.value.trim());
    renamingDialogVisible.value = false;
  }
};

// Exclusão de conversa
const deleteDialogVisible = ref(false);
const conversationIdToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  conversationIdToDelete.value = id;
  deleteDialogVisible.value = true;
};

const deleteConversation = () => {
  if (conversationIdToDelete.value) {
    conversationStore.deleteConversation(conversationIdToDelete.value);
    deleteDialogVisible.value = false;

    // Emitir evento para notificar o componente pai
    emit('conversation-changed');
  }
};

// Definir eventos emitidos
const emit = defineEmits<{
  (e: 'conversation-changed'): void
}>();
</script>

<style scoped>
.conversation-item:hover .actions {
  opacity: 1;
}

.actions {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
