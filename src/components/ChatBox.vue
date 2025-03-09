<template>
  <div id="chat-box" class="flex flex-col h-full">
    <div id="chat-container" class="relative w-full h-[calc(100%-100px)]">
      <div id="chat-area" ref="chatAreaRef" class="absolute overflow-y-auto inset-0">
        <div v-for="message in messages" :key="message.content">
          <ChatMessage :message="message" />
        </div>
        <div v-if="currentOutputMsgContent">
          <ChatMessage :message="{ role: 'agent', content: currentOutputMsgContent }" />
        </div>
      </div>
    </div>
    <div id="chat-input" ref="chatInputRef" class="flex h-[100px] w-full p-[10px] items-center justify-between">
      <Textarea id="chatInput" v-model="chatInput" @keyup.enter="submitChat"
        class="w-[calc(100%-82px)] h-full p-[10px] mr-10" />
      <Button id="submitChat" @click="submitChat">
        Send
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import ollama from 'ollama';
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);

const chatInput = ref('Why is the Sky Blue?');
const messages = ref([{ role: 'agent', content: 'Hey! I\'m Bolter. How can I help you today?' }]);
const currentOutputMsgContent = ref('');

const submitChat = async () => {
  console.log("Chatting with model: ", currentModel.value);
  const content = chatInput.value;
  chatInput.value = '';
  const inputMsg = { role: 'user', content };
  messages.value.push(inputMsg);

  const response = await ollama.chat({
    model: currentModel.value,
    messages: [inputMsg],
    stream: true,
  });

  for await (const part of response) {
    currentOutputMsgContent.value += part.message.content;
  }
  messages.value.push({ role: 'agent', content: currentOutputMsgContent.value });
  currentOutputMsgContent.value = '';
};
</script>
