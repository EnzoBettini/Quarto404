<template>
  <div>
    <!-- Caixa clicável do vídeo -->
    <div class="item-container" @click="abrirVideo"></div>

    <!-- Caixa clicável para o puzzle -->
    <div class="puzzle-container" @click="irParaPuzzle"></div>

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
      <button class="fechar-btn" @click="fecharVideo">Fechar</button>
    </div>

    <!-- Backdrop do modal -->
    <div v-if="videoVisivel" class="modal-backdrop"></div>
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
  // Se o vídeo já estiver visível, não faz nada (não reinicia)
  if (videoVisivel.value) return;

  videoVisivel.value = true;
  setTimeout(() => {
    videoPlayer.value?.play();
  }, 100);
}

function irParaPuzzle() {
  router.push({ name: 'CablePuzzle' }); // ATENÇÃO AQUI
}

function fecharVideo() {
  videoVisivel.value = false;
  videoPlayer.value?.pause();
  videoPlayer.value.currentTime = 0;
}
</script>

<style scoped>
.item-container {
  position: absolute;
  top: -500px;
  left: 25%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15); /* Torne mais visível para teste */
  border: 2px dashed #fff;
  cursor: pointer;
  z-index: 20; /* Garanta que está acima do vídeo */
  pointer-events: auto;
}

.item-container:hover {
  border-color: #a7a7a7;
}

.puzzle-container {
  position: absolute;
  top: -390px;
  left: 490px;
  width: 200px;
  height: 200px;
  background: rgba(0, 255, 255, 0.08);
  border: px dashed #0ff;
  cursor: pointer;
  pointer-events: auto;
  z-index: 50;
}

.puzzle-container:hover {
  border-color: #00ffff;
}

.modal-video {
  position: fixed;
  top: -550%;
  left: 50%;
   width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  z-index: 20;
  background: #111;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 40px #000a;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-modal-player {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}


.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 15;
  pointer-events: none;
}
</style>