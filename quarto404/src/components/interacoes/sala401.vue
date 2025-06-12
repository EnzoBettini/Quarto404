<template>
  <div>
    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle">
    </div>

    <puzzle401 v-if="puzzleVisivel" @exit="fecharPuzzle" />

    <div v-if="puzzleVisivel" class="modal-backdrop"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Overlay from '../efeitos/Overlay.vue';
import puzzle401 from './puzzle401.vue'; 
import { onMounted, onUnmounted } from 'vue';
import audioFile from '@/assets/audio/audiosamples/Samples/ambiente_sala401.wav';

let audio = null;
//variavel booleana para ativar o puzzle ou desativar
const puzzleVisivel = ref(false);


const abrirPuzzle = () => {
  puzzleVisivel.value = true;
};


const fecharPuzzle = () => {
  puzzleVisivel.value = false; //
};
onMounted(() => {
    console.log("Componente Sala401 montado: Iniciando áudio.");
    audio = new Audio(audioFile);
    audio.loop = true;
    audio.play().catch(error => {
        console.warn("A reprodução automática do áudio foi bloqueada pelo navegador:", error);
    });
});

onUnmounted(() => {
    console.log("Componente Sala401 desmontado: Parando áudio.");
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
  top: -150%;
  left: -9%;
  height: 100%;
  width: 45%;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 8px;
}

@media screen and (width: 1366px) and (height: 768px) {
.item-container {
    top: -110% !important;
     left: 8%;
    height: 80%;
    width: 35%;
    
  }
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
  z-index: 9; 
}
</style>