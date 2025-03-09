<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useModelStore } from '@/stores/model';
import { config } from '@/config';
import PullModelDialog from './PullModelDialog.vue';

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);

const getModels = async () => {
  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.models && data.models.length > 0) {
      const mostRecentModel = data.models.reduce((a, b) => (a.modified_at > b.modified_at ? a : b));
      modelStore.setCurrentModel(mostRecentModel.name);
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar modelos:", error);
    throw error;
  }
};

const { isPending, isError, data, error } = useQuery({
  queryKey: ['models'],
  queryFn: getModels
});

const loadingModelName = ref('');
const progressStatus = ref('');
const progressCompleted = ref(0);
const progressTotal = ref(0);
const progressPercent = computed(() => {
  return Math.floor((progressCompleted.value / progressTotal.value) * 100);
});

const pullModelWithProgress = async (model: string) => {
  loadingModelName.value = model;

  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: model,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Não foi possível ler a resposta');
    }

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
          progressStatus.value = data.status || '';
          progressCompleted.value = data.completed || 0;
          progressTotal.value = data.total || 100;
          console.log(data);
        } catch (e) {
          console.error('Erro ao processar chunk:', e);
        }
      }
    }
  } catch (error) {
    console.error("Erro ao baixar modelo:", error);
  } finally {
    loadingModelName.value = '';
  }
};

const queryClient = useQueryClient();
const pullModelMutation = useMutation({
  mutationFn: pullModelWithProgress,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ['models'] });
  }
});

const dialogVisible = ref(false);
const closeDialog = () => {
  dialogVisible.value = false;
};
const pullModel = (name: string) => {
  pullModelMutation.mutate(name);
  closeDialog();
};
</script>

<template>
  <div class="model-select p-4">
    <h2 class="text-lg font-bold mb-4">Selecionar Modelo</h2>

    <div v-if="isPending" class="mb-4">
      <Select placeholder="Carregando Modelos..." :loading="true" class="w-full"></Select>
    </div>
    <div v-else-if="isError" class="mb-4 text-red-500">
      Ocorreu um erro: {{ error }}
    </div>
    <div v-else-if="data" class="mb-4">
      <div class="flex items-center">
        <Select v-model="currentModel" :options="data.models" optionLabel="name" optionValue="model"
          placeholder="Selecione um Modelo" class="w-full" />
        <Button icon="pi pi-plus" aria-label="Adicionar Modelo" class="ml-2" @click="dialogVisible = true" />
      </div>
    </div>

    <div class="mb-4" v-if="loadingModelName">
      <div class="p-3 bg-gray-800 rounded-lg">
        <span class="font-semibold block mb-1">Carregando modelo: {{ loadingModelName }}</span>
        <span class="block mb-1">{{ progressStatus }}</span>
        <span class="font-mono block mb-1">{{ progressCompleted }}/{{ progressTotal }}</span>
        <ProgressBar :value="progressPercent"></ProgressBar>
      </div>
    </div>

    <PullModelDialog :visible="dialogVisible" @create="pullModel" @cancel="closeDialog" />
  </div>
</template>

<style scoped>
#modelSelectorContainer {
  display: flex;
}

#modelSelector {
  width: 100%;
  margin: 1rem;
}
</style>
