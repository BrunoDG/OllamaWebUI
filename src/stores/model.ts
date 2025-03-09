import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelStore = defineStore('model', () => {
  const currentModel = ref('deepseek-r1:latest')

  const setCurrentModel = (newModel: string) => {
    currentModel.value = newModel
  }
  return { currentModel, setCurrentModel }
})
