<template>
  <div>
    <!-- Caixa clicável do vídeo -->
    <div class="item-container" @click="abrirVideo"></div>
    
    <!-- Caixa clicável para o puzzle -->
    <div class="puzzle-container" @click="irParaPuzzle"></div>

      <div v-if="videoVisivel" class="modal-backdrop"></div>

    <!-- Modal de vídeo -->
    <div v-if="videoVisivel" class="modal-video">
      <video
        ref="videoPlayer"
        :src="videoFile"
        controls
        autoplay
        @ended="fecharVideo"
        class="video-modal-player"
      ></video>
    </div>

    <!-- Backdrop do modal -->
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import videoFile from '@/assets/videos/video_403.mp4';
import CablePuzzle from '@/components/interacoes/CablePuzzle.vue';





const router = useRouter();
const videoVisivel = ref(false);
const videoPlayer = ref(null);

function abrirVideo() {
  if (videoVisivel.value) return;

  videoVisivel.value = true;
  setTimeout(() => {
    videoPlayer.value?.play();
  }, 100);
}

function irParaPuzzle() {
  router.push({ name: 'CablePuzzle' });
}

function fecharVideo() {
  videoVisivel.value = false;
  videoPlayer.value?.pause();
  videoPlayer.value.currentTime = 0;
}
</script>

<style scoped>
  
.puzzle-container {
  position: absolute;
  top: -150%;
  left: 75%;
  width: 200px;
  height: 250px; 
  pointer-events: auto;
}

.item-container {
  position: absolute;
  top: -190%;
  left: 28%;
  width: 230px;
  height: 160px;
  cursor: pointer;
  z-index: 20;
  pointer-events: auto;
}

.item-container:hover {
  border-color: #a7a7a7;
}

.puzzle-container:hover {
  border-color: #00ffff;
}

.modal-video {
  position: absolute;
  top: -690px;
  left: -96%;
  width: 1600px;
  height:100vh;
  background: #1a1414;
  border-radius: 10px;
  box-shadow: 0 0 40px #000a;
}

.video-modal-player {
  width: 100%;
  height:100vh;
}

.modal-bacdrop{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 15;
  pointer-events: none;
}

</style>