<script setup lang="ts">
import ChatBox from '../components/ChatBox.vue'
import SidebarContent from '../components/SidebarContent.vue'
import OllamaConfig from '../components/OllamaConfig.vue'
import { ref, onMounted } from 'vue'

// Estado para controlar qual componente está visível na barra lateral
const sidebarTab = ref('main'); // 'main' ou 'config'

// Estado para controlar se a barra lateral está colapsada
const isSidebarCollapsed = ref(false);

// Função para alternar o estado da barra lateral
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value ? 'true' : 'false');
};

// Função para alternar entre as abas da barra lateral
const handleConversationChanged = () => {
  // Quando uma conversa é alterada, podemos atualizar algo se necessário
}

// Inicializar o estado da barra lateral a partir do localStorage
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true') {
    isSidebarCollapsed.value = true;
  }
});
</script>

<template>
  <main>
    <div class="flex h-full">
      <div :class="['transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'w-[calc(100%-50px)]' : 'w-3/4']">
        <ChatBox />
      </div>
      <div
        :class="['border-l border-color h-full bg-sidebar transition-all duration-300 ease-in-out relative', isSidebarCollapsed ? 'w-[50px]' : 'w-1/4']">

        <!-- Botão para colapsar/expandir a barra lateral (sempre visível) -->
        <button class="absolute z-10 top-50 left-0 -translate-x-1/2 text-color hover:text-primary transition-colors"
          @click="toggleSidebar" :title="isSidebarCollapsed ? 'Expandir' : 'Colapsar'">
          <i :class="['pi text-2xl', isSidebarCollapsed ? 'pi-chevron-left' : 'pi-chevron-right']"></i>
        </button>

        <template v-if="!isSidebarCollapsed">
          <!-- Abas da barra lateral -->
          <div class="flex border-b border-color bg-header">
            <button class="flex-1 py-2 text-center font-medium transition-colors text-xs"
              :class="sidebarTab === 'main' ? 'border-b-2 border-primary text-primary' : 'text-secondary hover:text-color'"
              @click="sidebarTab = 'main'">
              Principal
            </button>
            <button class="flex-1 py-2 text-center font-medium transition-colors text-xs"
              :class="sidebarTab === 'config' ? 'border-b-2 border-primary text-primary' : 'text-secondary hover:text-color'"
              @click="sidebarTab = 'config'">
              Conexão
            </button>
          </div>

          <!-- Conteúdo da barra lateral -->
          <div class="h-[calc(100%-40px)]">
            <SidebarContent v-if="sidebarTab === 'main'" @conversation-changed="handleConversationChanged" />
            <OllamaConfig v-else-if="sidebarTab === 'config'" />
          </div>
        </template>
        <template v-else>
          <!-- Ícones da barra lateral colapsada -->
          <div class="flex flex-col items-center py-4 space-y-6">
            <button class="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              :class="sidebarTab === 'main' ? 'bg-primary text-white' : 'text-secondary hover:text-color'"
              @click="sidebarTab = 'main'; isSidebarCollapsed = false;" title="Principal">
              <i class="pi pi-comments"></i>
            </button>
            <button class="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              :class="sidebarTab === 'config' ? 'bg-primary text-white' : 'text-secondary hover:text-color'"
              @click="sidebarTab = 'config'; isSidebarCollapsed = false;" title="Conexão">
              <i class="pi pi-server"></i>
            </button>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  overflow: hidden;
  background-color: var(--background-color);
  color: var(--text-color);
}

.bg-sidebar {
  background-color: var(--sidebar-bg-color);
}

.bg-header {
  background-color: var(--header-bg-color);
}

.bg-chat {
  background-color: var(--chat-bg-color);
}

.border-color {
  border-color: var(--border-color);
}

.text-secondary {
  color: var(--text-secondary-color, #888888);
}

.text-color {
  color: var(--text-color);
}

/* Botão semicircular */
.semicircle-button {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  cursor: pointer;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

:deep(.p-button) {
  background-color: var(--primary-color, #9d0505);
  border-color: var(--primary-color, #9d0505);
}

:deep(.p-button:hover) {
  background-color: var(--primary-color-darker, #7d0404);
  border-color: var(--primary-color-darker, #7d0404);
}

:deep(.bg-primary) {
  background-color: var(--primary-color, #9d0505) !important;
}

.bg-primary {
  background-color: var(--primary-color, #9d0505) !important;
}

.bg-primary-darker {
  background-color: var(--primary-color-darker, #7d0404) !important;
}

:deep(.border-primary) {
  border-color: var(--primary-color, #9d0505) !important;
}

:deep(.text-primary) {
  color: var(--primary-color, #9d0505) !important;
}
</style>
