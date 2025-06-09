<template>
  <div>
    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle">
      <Overlay nome="televisao_401" />
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
  top: -420%;
  left: 12%; 

  transform: translate(-50%, -50%);
  width: 13vw;

  cursor: pointer;
  pointer-events: auto;

  border: 3px solid transparent;
  border-radius: 8px;
  transition: border-color 0.2s ease-in-out;
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