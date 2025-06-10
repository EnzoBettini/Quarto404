<template>
  <div>
    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle"></div>

    <Transition name="fade" mode="out-in">
      <component
        :is="currentStage === '402' ? Puzzle402 : Puzzle402a"
        v-if="puzzleVisivel"
        :key="currentStage"
        @exit="handleExit"
        @success="switchTo402a"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Puzzle402 from './puzzle402.vue';
import Puzzle402a from './puzzle402a.vue';
import audioFile from '@/assets/audio/audiosamples/Samples/Ambiente402.mp3';

const currentStage = ref('402');
const puzzleVisivel = ref(false);

let audio = null;

const abrirPuzzle = () => {
  puzzleVisivel.value = true;
};

const fecharPuzzle = () => {
  puzzleVisivel.value = false;
};

const handleExit = () => {
  if (currentStage.value === '402') {
    currentStage.value = '402a';
  } else {
    fecharPuzzle();
  }
};

const switchTo402a = () => {
  currentStage.value = '402a';
};

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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
