<template>
  <div class="pull-model-dialog">
    <Dialog v-model:visible="visible" modal header="Carregar novo modelo" :style="{ width: '25rem' }">
      <span class="block mb-5 text-white">Digite o nome do modelo que você deseja adicionar</span>
      <div class="flex items-center gap-3 mb-5">
        <label for="model-name" class="font-semibold w-[6rem] text-white">Nome do modelo</label>
        <InputText id="model-name" v-model="name" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button label="Cancelar" severity="secondary" class="p-button-text text-white" @click="emit('cancel')" />
        <Button label="Carregar" class="p-button-success" @click="emit('create', name)" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const { visible } = toRefs(props);

const name = ref('');

const emit = defineEmits<{
  (e: 'create', name: string): void;
  (e: 'cancel'): void;
}>();
</script>
