<script setup lang="ts">
import ChatBox from '../components/ChatBox.vue'
import ModelSelector from '../components/ModelSelect.vue'
</script>

<template>
  <main>
    <div class="flex h-full">
      <div class="w-3/4">
        <ChatBox />
      </div>
      <div class="w-1/4">
        <ModelSelector />
      </div>
    </div>
  </main>
</template>
