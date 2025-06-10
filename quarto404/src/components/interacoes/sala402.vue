<template>
  <div>
    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle">
      
    </div>

    <Puzzle402 v-if="puzzleVisivel" @exit="fecharPuzzle" />

    <div v-if="puzzleVisivel" class="modal-backdrop"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';
import Overlay from '../efeitos/Overlay.vue';
import Puzzle402 from './puzzle402.vue'; 
import audioFile from '@/assets/audio/audiosamples/Samples/Ambiente402.mp3';

const emit = defineEmits(['puzzle-opened', 'puzzle-closed', 'show-image', 'hide-image']);
let audio = null;
const puzzleVisivel = ref(false);

const abrirPuzzle = () => {
  puzzleVisivel.value = true;
  emit('puzzle-opened');
  emit('show-image', '402a');
};

const fecharPuzzle = () => {
  puzzleVisivel.value = false;
  emit('puzzle-closed');
  emit('hide-image', '402a');
};

onMounted(() => {
  console.log("Componente Sala402 montado: Iniciando áudio.");
  audio = new Audio(audioFile);
  audio.loop = true;
  audio.play().catch(error => {
    console.warn("A reprodução automática do áudio foi bloqueada pelo navegador:", error);
  });
});

onUnmounted(() => {
  console.log("Componente Sala402 desmontado: Parando áudio.");
  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
});
</script>

<style scoped>
.item-container {
  position: absolute;
  top: -1000%; /* Adjust as needed */
  left: 154%;
  width: 290px;  /* Set fixed width for debugging/clickable area */
  height: 500px; /* Set fixed height */
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
}

.item-container:hover {
  border-color: #a7a7a777;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Dim background */
  z-index: 9;
  pointer-events: auto; /* Block clicks behind modal */
}
</style>
