<template>
  <div class="sala-container">
    <video v-if="videoSource && !mostrarImagem402a" ref="salaVideoPlayer" class="sala-video" :src="videoSource" autoplay
      v-bind:loop="idQuarto !== '404_2'" playsinline @canplaythrough="videoPronto" :class="{ 'visible': videoVisivel }"
      :key="videoSource" @ended="aoTerminarVideo">
      Seu navegador não suporta vídeos.
    </video>

    <!-- Use imported image variable here -->
    <img v-if="mostrarImagem402a" :src="img402a" class="sala-img" />

    <div v-if="!videoSource && !erroAoCarregar" class="loading-message">
      Carregando quarto {{ idQuarto }}...
    </div>
    <div v-if="erroAoCarregar" class="error-message">
      Erro ao carregar vídeo para o quarto {{ idQuarto }}.<br />Verifique se o arquivo existe em src/assets/videos/ e se
      o ID está correto.
    </div>

    <div class="sala-overlay" :class="{ 'visible': videoVisivel }">
      <Voltar v-if="props.idQuarto !== '404_2'" rota="/corredor"/>

      <div class="interacoes-container">
        <Sala402 v-if="idQuarto === '402'" @puzzle-opened="mostrarImagem402a = true"
          @puzzle-closed="mostrarImagem402a = false" @show-image="onShowImage" @hide-image="onHideImage" />
        <component v-else :is="componenteDeInteracaoAtual" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';
import Sala401 from './interacoes/sala401.vue';
import Sala402 from './interacoes/sala402.vue';
import Sala403 from './interacoes/sala403.vue';
import Voltar from './Voltar.vue';

// Import the image file properly
import img402a from '@/assets/images/402a.png';

const props = defineProps({
  idQuarto: {
    type: String,
    required: true
  }
});

const router = useRouter();
const salaVideoPlayer = ref(null);
const videoVisivel = ref(false);
const erroAoCarregar = ref(false);
const mostrarImagem402a = ref(false);

function onShowImage(img) {
  if (img === '402a') mostrarImagem402a.value = true;
}
function onHideImage(img) {
  if (img === '402a') mostrarImagem402a.value = false;
}

const chavesColetadas = ref({
  '401': false,
  '402': false,
  '403': false
});

const chaveDesteQuartoJaColetada = computed(() => chavesColetadas.value[props.idQuarto]);
const mensagemChaveColetada = ref('');

const textoBotaoPegarChave = computed(() =>
  chaveDesteQuartoJaColetada.value ? 'Chave Coletada!' : 'Pegar Chave'
);

const deveMostrarBotaoPegarChave = computed(() =>
  ['401', '402', '403'].includes(props.idQuarto)
);

import video401File from '@/assets/videos/401_animated.mp4';
import video402File from '@/assets/videos/402_animated.mp4';
import video403File from '@/assets/videos/403_animated.mp4';
import video404_2File from '@/assets/videos/404_animated.mp4';



const mapaDeInteracoes = {
  '401': Sala401,
  '402': Sala402,
  '403': Sala403
};

const videosDisponiveis = {
  '401': video401File,
  '402': video402File,
  '403': video403File,
  '404_2': video404_2File
};

const videoSource = computed(() => {
  const source = videosDisponiveis[props.idQuarto];
  if (!source) {
    erroAoCarregar.value = true;
    return null;
  }
  erroAoCarregar.value = false;
  return source;
});

const videoPronto = () => {
  setTimeout(() => {
    videoVisivel.value = true;
  }, 100);
};

const componenteDeInteracaoAtual = computed(() =>
  mapaDeInteracoes[props.idQuarto] || null
);

const voltarAoCorredor = () => {
  router.push({ name: 'Corredor' });
};

const voltarAoMenuPrincipal = () => {
  router.push({ name: 'Menu' });
};

const pegarChave = () => {
  if (!chaveDesteQuartoJaColetada.value && videosDisponiveis[props.idQuarto]) {
    chavesColetadas.value[props.idQuarto] = true;
    mensagemChaveColetada.value = `Você pegou a chave do Quarto ${props.idQuarto}!`;
    setTimeout(() => {
      mensagemChaveColetada.value = '';
    }, 3000);
  }
};

watch(() => props.idQuarto, (newId, oldId) => {
  if (newId !== oldId) {
    videoVisivel.value = false;
    mensagemChaveColetada.value = '';
    if (salaVideoPlayer.value && videosDisponiveis[newId]) {
      salaVideoPlayer.value.load();
      salaVideoPlayer.value.play().catch(e => console.warn("Erro ao iniciar novo vídeo", e));
    } else if (!videosDisponiveis[newId]) {
      erroAoCarregar.value = true;
    }
  }
}, { immediate: false });

onMounted(() => {
  videoVisivel.value = false;
  mensagemChaveColetada.value = '';
  if (!videoSource.value) {
    erroAoCarregar.value = true;
  }
});

function aoTerminarVideo() {
  if (props.idQuarto === '404_2') {
    router.push({ name: 'creditosdown' });
  }
}
</script>

<style scoped>
.sala-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #1a1a1a;
}
.sala-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 1.2s ease-in;
}
.sala-video.visible {
  opacity: 1;
}

.loading-message, .error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5em;
  z-index: 3;
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
}
.error-message {
  color: #ff8a80;
}

.sala-overlay {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 15px;
  opacity: 0;
  transition: opacity 1s ease-in-out 0.8s;
}
.sala-overlay.visible {
  opacity: 1;
}

.sala-button {
  padding: 12px 25px;
  font-size: 1.1em;
  color: #e0e0e0;
  background-color: rgba(30, 30, 30, 0.8);
  border: 1px solid #888;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.sala-button:hover {
  background-color: rgba(50, 50, 50, 0.9);
  border-color: #aaa;
}
.sala-button:disabled {
  background-color: rgba(10, 10, 10, 0.7);
  border-color: #555;
  color: #777;
  cursor: not-allowed;
}

.feedback-message {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 150, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 3;
  font-size: 1.1em;
  transition: opacity 0.5s ease;
}

.interacoes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.sala-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.8s;
}
</style>
