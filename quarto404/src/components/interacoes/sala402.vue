<!-- Sala402.vue -->

<template>

   <div>

    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle"></div>



   
    <Puzzle402 v-if="puzzleVisivel"  @exit="fecharPuzzle" @success="aoResolverPuzzle" />



    <div v-if="puzzleVisivel" class="modal-backdrop"></div>



     <!-- Image Display -->

    <transition name="fade">

       <img  v-if="puzzleVisivel"  :src="require(`@/assets/images/${imagemAtual}.png`)"
        class="image-display"  :class="{ 'fade-out': fadeOut }"/>

     </transition>

  
  </div>

</template>



<script setup>

import { ref, onMounted, onUnmounted, defineEmits } from 'vue';

import Puzzle402 from './puzzle402.vue';

import audioFile from '@/assets/audio/audiosamples/Samples/Ambiente402.mp3';



const emit = defineEmits(['puzzle-opened', 'puzzle-closed', 'show-image', 'hide-image']);

let audio = null;



const puzzleVisivel = ref(false);

const imagemAtual = ref('402a');

const fadeOut = ref(false);



const abrirPuzzle = () => {

  puzzleVisivel.value = true;

  emit('puzzle-opened');

  emit('show-image', '402a');

};



const fecharPuzzle = () => {

  puzzleVisivel.value = false;

  emit('puzzle-closed');

  emit('hide-image', imagemAtual.value);

};



const aoResolverPuzzle = () => {

  fadeOut.value = true;

  setTimeout(() => {

    imagemAtual.value = '402b';

    fadeOut.value = false;

  }, 1000);

};



onMounted(() => {

  audio = new Audio(audioFile);

  audio.loop = true;

  audio.play().catch(error => {

    console.warn("A reprodução automática do áudio foi bloqueada pelo navegador:", error);

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
.item-container {

  position: absolute;

  top: -1000%;

  left: 154%;

  width: 290px;

  height: 500px;

  cursor: pointer;

  pointer-events: auto;

  z-index: 10;

}



.modal-backdrop {

  position: fixed;

  top: 0;

  left: 0;

  width: 100vw;

  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);

  z-index: 9;

  pointer-events: auto;

}



.image-display {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: auto;

  z-index: 5;

  transition: opacity 1s ease;

}



.fade-out {

  opacity: 0;

}



.fade-enter-active,
.fade-leave-active {

  transition: opacity 1s ease;

}



.fade-enter,
.fade-leave-to {

  opacity: 0;

}
</style>