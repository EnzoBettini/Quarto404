<template>
  <div class="corridor-container">
    <video
      ref="corridorVideoPlayer"
      class="corridor-video"
      :class="{ 'visible': videoIsReadyAndVisible }"
      :src="corridorVideoSource"
      autoplay
      loop
      muted
      playsinline
      @canplaythrough="handleVideoReady"
    >
      Seu navegador não suporta o elemento de vídeo.
    </video>

    <div class="areas-interativas" :class="{ 'visible': videoIsReadyAndVisible }">
      <div class="porta porta-401" @click="irParaQuarto('401')">
        <div class="numero">401</div>
      </div>

      <div class="porta porta-402" @click="irParaQuarto('402')">
        <div class="numero">402</div>
      </div>

      <div class="porta porta-403" @click="irParaQuarto('403')">
        <div class="numero">403</div>
      </div>

      <div class="porta porta-404" @click="irParaTexto()">
        <div class="numero">404</div>
      </div>

      <Voltar rota="/" class="voltar-posicao"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import corridorVideoFile from '@/assets/videos/corridor_animated.mp4';
import Voltar from '@/components/Voltar.vue';

const router = useRouter();
const corridorVideoPlayer = ref(null);
const corridorVideoSource = ref(corridorVideoFile);
const videoIsReadyAndVisible = ref(false);

const handleVideoReady = () => {
  console.log("Vídeo do corredor pronto para tocar.");
  setTimeout(() => {
    videoIsReadyAndVisible.value = true;
  }, 100);
};

const irParaQuarto = (idDoQuarto) => {
  router.push({ name: 'Sala', params: { idQuarto: idDoQuarto } });
};

const irParaTexto = () => {
  router.push({ name: 'ending' });
};

const voltarAoMenu = () => {
  router.push({ name: 'Menu' });
};

onMounted(() => {
  console.log("Componente CorredorView montado.");
});
</script>

<style scoped>
.corridor-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.corridor-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  filter: brightness(150%);
}

.corridor-video.visible {
  opacity: 1;
}

.areas-interativas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
  transition: opacity 1.5s ease-in-out 0.5s;
}

.areas-interativas.visible {
  opacity: 1;
}

.porta {
  position: absolute;
  cursor: pointer;
  border: 2px solid transparent;
}

.numero {
  display: none;
}

.porta-401 {
  left: 11%;
  top: 29%;
  width: 13%;
  height: 60%;
}

.porta-402 {
  left: 31%;
  top: 33%;
  width: 13%;
  height: 43%;
}

.porta-403 {
  left: 56%;
  top: 34%;
  width: 13%;
  height: 43%;
}

.porta-404 {
  left: 77%;
  top: 30%;
  width: 13%;
  height: 60%;
}

.voltar-posicao {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}

/* Responsividade para diferentes tamanhos de tela */
@media (max-width: 768px) {
  .porta-401, .porta-402, .porta-403, .porta-404 {
    width: 15%;
    height: 40%;
  }
}

@media (max-width: 480px) {
  .porta-401 {
    left: 10%;
    width: 18%;
  }

  .porta-402 {
    left: 35%;
    width: 18%;
  }

  .porta-403 {
    left: 60%;
    width: 18%;
  }

  .porta-404 {
    left: 85%;
    width: 18%;
  }
}
</style>
