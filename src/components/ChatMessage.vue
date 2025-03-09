<template>
  <div :class="messageClass">
    <Avatar :class="avatarClass">
      <i :class="avatarIconClass" class="font-bold"></i>
    </Avatar>
    <div class="mx-0 my-[1rem] p-[15px]">{{ props.message.content }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from 'ollama';
import { computed } from 'vue';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'flex p-[10px] justify-content-start m-[10px] border-r-primary bg-primary' : 'flex p-[10px] justify-content-end m-[10px] border-r-[10px] border-r-secondary bg-secondary';
});

const avatarClass = computed(() => {
  return props.message.role === 'user' ? 'w-[3rem] h-[3rem]' : 'w-[3rem] h-[3rem]';
});

const avatarIconClass = computed(() => {
  return props.message.role === 'user' ? 'pi pi-user' : 'pi pi-desktop';
});
</script>
