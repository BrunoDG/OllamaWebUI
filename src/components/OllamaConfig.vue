<template>
  <div class="ollama-config p-4">
    <h2 class="text-lg font-bold mb-4">Configuração do Ollama</h2>

    <div class="mb-4">
      <label for="ollamaUrl" class="block text-sm font-medium mb-1">URL do Servidor Ollama</label>
      <div class="flex">
        <InputText id="ollamaUrl" v-model="ollamaUrl" placeholder="http://192.168.1.8:11434" class="w-full" />
        <Button icon="pi pi-save" class="ml-2" @click="saveSettings" />
      </div>
      <small class="block mt-1 text-gray-400">
        Exemplo: http://192.168.1.8:11434 (IP do computador com Ollama)
      </small>
    </div>

    <div class="mb-4">
      <Button label="Testar Conexão" icon="pi pi-check" @click="testConnection" :loading="testing" />
      <span v-if="connectionStatus" :class="['ml-2', connectionStatus.success ? 'text-green-500' : 'text-red-500']">
        {{ connectionStatus.message }}
      </span>
    </div>

    <div class="bg-gray-800 p-3 rounded-lg">
      <h3 class="font-semibold mb-2">Como configurar:</h3>
      <ol class="list-decimal pl-5 space-y-2 text-gray-300">
        <li>No computador onde o Ollama está instalado, execute o seguinte comando para permitir conexões
          remotas:
          <pre class="bg-gray-900 text-white p-2 rounded mt-1 overflow-x-auto">
OLLAMA_HOST=0.0.0.0 ollama serve</pre>
        </li>
        <li>Certifique-se de que o firewall permita conexões na porta 11434</li>
        <li>Digite o endereço IP do computador com Ollama no campo acima</li>
        <li>Clique em "Testar Conexão" para verificar se está funcionando</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { config, saveConfig } from '@/config';

const ollamaUrl = ref(config.ollamaBaseUrl);
const testing = ref(false);
const connectionStatus = ref<{ success: boolean; message: string } | null>(null);

// Testar a conexão com o servidor Ollama
const testConnection = async () => {
  testing.value = true;
  connectionStatus.value = null;

  try {
    const response = await fetch(`${ollamaUrl.value}/api/tags`);

    if (response.ok) {
      connectionStatus.value = {
        success: true,
        message: 'Conexão estabelecida com sucesso!'
      };
    } else {
      connectionStatus.value = {
        success: false,
        message: `Erro: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    connectionStatus.value = {
      success: false,
      message: `Erro de conexão: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    testing.value = false;
  }
};

// Salvar as configurações
const saveSettings = () => {
  saveConfig({ ollamaBaseUrl: ollamaUrl.value });

  // Mostrar mensagem de sucesso
  connectionStatus.value = {
    success: true,
    message: 'Configurações salvas! Recarregue a página para aplicar.'
  };
};

onMounted(() => {
  ollamaUrl.value = config.ollamaBaseUrl;
});
</script>
