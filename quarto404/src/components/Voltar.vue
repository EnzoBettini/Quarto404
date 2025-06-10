<template>
  <div class="voltar-container" @click="navegarPara">
    <img src="/flecha.png" alt="Voltar" class="voltar-seta" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  rota: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();

const navegarPara = () => {
  console.log("Navegando para: ", props.rota);
  router.push({
    path: props.rota,
    params: props.params
  });
};
</script>

<style scoped>
.voltar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 550px;
  height: 200px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.voltar-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 0, 0, 0.25) 0%, transparent 70%);
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.08);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.voltar-container:hover::before {
  opacity: 0.3;
}

.voltar-container:active::before {
  opacity: 0.6;
}

.voltar-seta {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  z-index: 1;
}

.voltar-container:hover .voltar-seta {
  transform: scale(1.1);
}

.voltar-container:active .voltar-seta {
  transform: scale(0.95);
}
</style>