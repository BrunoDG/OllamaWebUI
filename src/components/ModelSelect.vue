<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import ollama from 'ollama';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useModelStore } from '@/stores/model';
import PullModelDialog from './PullModelDialog.vue';

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);

const getModels = async () => {
  const response = await ollama.list();
  const mostRecentModel = response.models.reduce((a, b) => (a.modified_at > b.modified_at ? a : b));
  modelStore.setCurrentModel(mostRecentModel.name);
  return response;
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
  const pullProgress = await ollama.pull({ model, stream: true });
  for await (const part of pullProgress) {
    progressStatus.value = part.status;
    progressCompleted.value = part.completed || 0;
    progressTotal.value = part.total || 100;
    console.log(part);
  }
  loadingModelName.value = '';
};

const queryClient = useQueryClient();
const pullModelMutation = useMutation({
  mutationFn: pullModelWithProgress,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ['models'] });
  }
});

const dialogVisible = ref(false);
const pullModel = (name: string) => {
  pullModelMutation.mutate(name);
  dialogVisible.value = false;
};
</script>

<template>
  <div class="flex w-full">
    <div class="w-full m-4 flex flex-col h-40">
      <span class="text-lg font-bold">Model</span>
      <div v-if="isPending" class="w-full">
        <Select placeholder="Carregando Modelos..." :loading="true" class="w-full md:w-56"></Select>
      </div>
      <div v-else-if="isError" class="text-red-500">Ocorreu um erro: {{ error }}</div>
      <div v-else-if="data" class="flex">
        <Select v-model="currentModel" :options="data.models" optionLabel="name" optionValue="model"
          placeholder="Selecione um Modelo" class="w-full md:w-56" />
        <Button icon="pi pi-plus" aria-label="Adicionar Modelo" class="ml-2" @click="dialogVisible = true" />
      </div>
      <div class="flex flex-col mt-2 w-full" v-if="loadingModelName">
        <span class="font-semibold">Carregando modelo: {{ loadingModelName }}</span>
        <span>{{ progressStatus }}</span>
        <span class="font-mono">{{ progressCompleted }}/{{ progressTotal }}</span>
        <ProgressBar :value="progressPercent"></ProgressBar>
      </div>
    </div>
    <PullModelDialog :visible="dialogVisible" @create="pullModel" @cancel="dialogVisible = false" />
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
