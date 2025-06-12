<template>
  <div class="sala402-wrapper">
    <!-- Área clicável da geladeira -->
    <div class="item-container" @click="abrirGeladeira"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import audioFile from '@/assets/audio/audiosamples/Samples/Ambiente402.mp3';

const router = useRouter();
let audio = null;

// Navega para a página da geladeira
function abrirGeladeira() {
  router.push('/quarto/402/geladeira');
}

onMounted(() => {
  audio = new Audio(audioFile);
  audio.loop = true;
  audio.play().catch(err => {
    console.warn("A reprodução automática do áudio foi bloqueada:", err);
  });
});

onUnmounted(() => {
  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
});
</script>

<style scoped>
.sala402-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.item-container {
  position: absolute;
  top: -159%;
  left: 120%;
  width: 290px;
  height: 500px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
}
@media screen and (width: 1366px) and (height: 768px) {
.item-container {
    top: -130% !important;
     left: 95%;

  }
}
</style>