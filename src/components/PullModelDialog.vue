<template>
  <div class="pull-model-dialog">
    <Dialog v-model:visible="visible" modal header="Load a new model" :style="{ width: '25rem' }">
      <span class="p-text-secondary block mb-5">Enter the model name you want to add</span>
      <div class="flex items-center gap-3 mb-5">
        <label for="breakout-name" class="font-semibold w-[6rem]">Model name</label>
        <InputText id="breakout-name" v-model="name" class="flex-auto" autocomplete="off" />

      </div>
      <div class="flex justify-content-end gap-2">
        <Button label="Cancel" severity="secondary" class="p-button-text" @click="emit('cancel')" />
        <Button label="Load" class="p-button-success" @click="emit('create', name)" />
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
