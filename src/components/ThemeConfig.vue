<template>
  <div class="theme-config p-4">
    <h2 class="text-lg font-bold mb-4">Configuração do Tema</h2>

    <div class="mb-4">
      <label for="themeColor" class="block text-sm font-medium mb-1">Cor do Tema</label>
      <div class="flex items-center">
        <div class="color-preview mr-3" :style="{ backgroundColor: themeColor }"></div>
        <InputText id="themeColor" v-model="themeColor" placeholder="#9d0505" class="w-full" />
      </div>
      <small class="block mt-1 text-gray-400">
        Digite um código de cor hexadecimal (ex: #9d0505) ou RGB (ex: rgb(157, 5, 5))
      </small>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Cores Predefinidas</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="color in predefinedColors" :key="color.value" class="color-button"
          :style="{ backgroundColor: color.value }" @click="themeColor = color.value" :title="color.name"></button>
      </div>
    </div>

    <div class="mb-4">
      <Button label="Aplicar Tema" icon="pi pi-check" @click="applyTheme" />
      <Button label="Restaurar Padrão" icon="pi pi-refresh" class="ml-2" severity="secondary" @click="resetTheme" />
    </div>

    <div class="p-3 bg-gray-800 rounded-lg">
      <p class="text-sm text-gray-300">
        O tema será aplicado imediatamente, mas para uma experiência completa, recarregue a página após aplicar o tema.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Cores predefinidas
const predefinedColors = [
  { name: 'Bevel Drive Vermelho', value: '#9d0505' },
  { name: 'Azul', value: '#0077b6' },
  { name: 'Verde', value: '#2a9d8f' },
  { name: 'Roxo', value: '#7209b7' },
  { name: 'Laranja', value: '#f4a261' },
  { name: 'Preto', value: '#333333' },
];

// Cor do tema atual
const themeColor = ref('#9d0505');

// Aplicar o tema
const applyTheme = () => {
  // Validar a cor
  if (!/^#[0-9A-F]{6}$/i.test(themeColor.value) &&
    !/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(themeColor.value)) {
    alert('Por favor, insira uma cor válida no formato hexadecimal (#RRGGBB) ou RGB.');
    return;
  }

  // Aplicar a cor como variável CSS
  document.documentElement.style.setProperty('--primary-color', themeColor.value);

  // Calcular uma versão mais escura para hover
  const darkerColor = themeColor.value.replace(
    /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
    (_, r, g, b) => {
      const darken = (hex: string) => {
        const num = Math.max(0, parseInt(hex, 16) - 32);
        return num.toString(16).padStart(2, '0');
      };
      return `#${darken(r)}${darken(g)}${darken(b)}`;
    }
  );
  document.documentElement.style.setProperty('--primary-color-darker', darkerColor);

  // Salvar a cor no localStorage
  localStorage.setItem('theme_color', themeColor.value);
};

// Restaurar o tema padrão
const resetTheme = () => {
  themeColor.value = '#9d0505';
  applyTheme();
};

// Carregar a cor salva ao montar o componente
onMounted(() => {
  const savedColor = localStorage.getItem('theme_color');
  if (savedColor) {
    themeColor.value = savedColor;
    document.documentElement.style.setProperty('--primary-color', savedColor);

    // Calcular e aplicar a cor mais escura
    const darkerColor = savedColor.replace(
      /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
      (_, r, g, b) => {
        const darken = (hex: string) => {
          const num = Math.max(0, parseInt(hex, 16) - 32);
          return num.toString(16).padStart(2, '0');
        };
        return `#${darken(r)}${darken(g)}${darken(b)}`;
      }
    );
    document.documentElement.style.setProperty('--primary-color-darker', darkerColor);
  } else {
    // Definir a cor padrão se não houver cor salva
    document.documentElement.style.setProperty('--primary-color', themeColor.value);
    document.documentElement.style.setProperty('--primary-color-darker', '#7d0404');
  }
});
</script>

<style scoped>
.color-preview {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: 1px solid #444444;
}

.color-button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: 1px solid #444444;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-button:hover {
  transform: scale(1.1);
}
</style>
