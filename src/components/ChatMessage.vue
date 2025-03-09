<template>
  <div :class="messageClass">
    <div :class="contentClass">
      <div class="flex items-center mb-2">
        <Avatar :class="avatarClass">
          <i :class="avatarIconClass" class="font-bold"></i>
        </Avatar>
        <span class="ml-2 font-semibold">{{ props.message.role === 'user' ? 'Você' : 'Bolter' }}</span>
      </div>
      <div v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from 'ollama';
import { computed, onMounted } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

// Configurar o marked para usar highlight.js
onMounted(() => {
  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
    gfm: true,
    breaks: true
  });
});

// Renderizar o conteúdo markdown
const renderedContent = computed(() => {
  return marked(props.message.content);
});

const messageClass = computed(() => {
  return props.message.role === 'user'
    ? 'flex p-[10px] justify-start m-[10px]'
    : 'flex p-[10px] justify-end m-[10px]';
});

const contentClass = computed(() => {
  return props.message.role === 'user'
    ? 'p-4 bg-primary text-white rounded-3xl rounded-bl-none shadow-md max-w-[80%] markdown-content'
    : 'p-4 bg-secondary text-white rounded-3xl rounded-br-none shadow-md max-w-[80%] markdown-content';
});

const avatarClass = computed(() => {
  return props.message.role === 'user' ? 'w-[2rem] h-[2rem]' : 'w-[2rem] h-[2rem]';
});

const avatarIconClass = computed(() => {
  return props.message.role === 'user' ? 'pi pi-user' : 'pi pi-desktop';
});
</script>

<style scoped>
.markdown-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-content :deep(code) {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.markdown-content :deep(p) {
  margin: 0.5rem 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1rem 0 0.5rem 0;
  font-weight: bold;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
}

.markdown-content :deep(a) {
  color: #4dabf7;
  text-decoration: underline;
}
</style>
