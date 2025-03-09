<template>
  <div class="pull-model-dialog">
    <Dialog v-model:visible="dialogVisible" modal header="Carregar novo modelo" :style="{ width: '25rem' }">
      <span class="block mb-5 text-white">Digite o nome do modelo que você deseja adicionar</span>
      <div class="flex items-center gap-3 mb-5">
        <label for="model-name" class="font-semibold w-[6rem] text-white">Nome do modelo</label>
        <InputText id="model-name" v-model="name" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button label="Cancelar" severity="secondary" class="p-button-text text-white" @click="handleCancel" />
        <Button label="Carregar" class="p-button-success" @click="handleCreate" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const { visible } = toRefs(props);

const dialogVisible = ref(false);

// Sincronizar a prop visible com o estado local dialogVisible
watch(visible, (newValue) => {
  dialogVisible.value = newValue;
});

// Quando dialogVisible muda para false, emitir o evento cancel
watch(dialogVisible, (newValue) => {
  if (!newValue && visible.value) {
    emit('cancel');
  }
});

const name = ref('');

const emit = defineEmits<{
  (e: 'create', name: string): void;
  (e: 'cancel'): void;
}>();

const handleCancel = () => {
  dialogVisible.value = false;
  emit('cancel');
};

const handleCreate = () => {
  dialogVisible.value = false;
  emit('create', name.value);
};
</script>
