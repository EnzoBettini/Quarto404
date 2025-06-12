<template>
  <Shake :ativacao="shakeAtivado" :intensidade="8" :duracao="600" @shake-complete="shakeAtivado = false">
    <div class="corridor-container">
      <video ref="corridorVideoPlayer" class="corridor-video" :class="{ 'visible': videoIsReadyAndVisible }"
        :src="corridorVideoSource" autoplay muted playsinline>
        Seu navegador não suporta o elemento de vídeo.
      </video>

      <div class="areas-interativas" :class="{ 'visible': videoIsReadyAndVisible }">
        <div v-for="quarto in statusQuartos" :key="quarto.numero" :class="['porta', `porta-${quarto.numero}`, {
          'porta-bloqueada': quarto.bloqueado,
          'porta-completada': quarto.completado
        }]" @click="tentarEntrarQuarto(quarto)">
          <div class="numero">{{ quarto.numero }}</div>
          <div v-if="quarto.bloqueado" class="icone-bloqueado">🔒</div>
          <div v-if="quarto.completado" class="icone-completado">✓</div>
        </div>

        <Voltar rota="/" class="voltar-posicao" />
      </div>

      <!-- Modal de Bloqueio -->
      <div v-if="modalBloqueio.ativo" class="modal-overlay" @click="fecharModal">
        <div class="modal-bloqueio" @click.stop>
          <div class="modal-header">
            <h3>🔒 QUARTO BLOQUEADO</h3>
          </div>
          <div class="modal-content">
            <p>{{ modalBloqueio.mensagem }}</p>
            <div class="quarto-requisito">
              Complete o <strong>Quarto {{ modalBloqueio.quartoRequisito }}</strong> primeiro
            </div>
          </div>
          <div class="modal-actions">
            <button @click="irParaQuartoRequisito" class="btn-ir-quarto">
              Ir para Quarto {{ modalBloqueio.quartoRequisito }}
            </button>
            <button @click="fecharModal" class="btn-fechar">
              Fechar
            </button>
          </div>
        </div>
      </div>

    </div>
  </Shake>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import corridorVideoFile from '@/assets/videos/corridor_animated.mp4';
import Voltar from '@/components/Voltar.vue';
import Shake from '@/components/efeitos/Shake.vue';
import { obterStatusCompleto, debugProgresso } from '@/assets/utils/puzzleProgress';
import startSoundFile from '@/assets/audio/audiosamples/Samples/simpleboom.wav';

const router = useRouter();
const corridorVideoPlayer = ref(null);
const corridorVideoSource = ref(corridorVideoFile);
const videoIsReadyAndVisible = ref(false);
const shakeAtivado = ref(false);
const atualizacaoForcada = ref(0); // Para forçar reavaliação do computed

const portaFechada = () => {
  try {
    const audio = new Audio(startSoundFile);
    audio.volume = 0.3;
    audio.play().catch(error => {
      console.error("Erro ao tentar tocar o som de início:", error);
    });
  } catch (error) {
    console.error("Erro ao criar o objeto de áudio:", error);
  }
}
// Estado do modal de bloqueio
const modalBloqueio = ref({
  ativo: false,
  mensagem: '',
  quartoRequisito: null,
  quartoTentativa: null
});

// Computed para obter status dos quartos
const statusQuartos = computed(() => {
  // Forçar reavaliação quando atualizacaoForcada mudar
  console.log('Atualizando status dos quartos', atualizacaoForcada.value);

  const status = obterStatusCompleto();
  // Garantir que o quarto 401 nunca esteja bloqueado
  const quarto401 = status.find(q => q.numero === '401');
  if (quarto401) {
    quarto401.liberado = true;
    quarto401.bloqueado = false;
  }

  // Log para debug
  console.log('Status dos quartos atualizado:', status);
  return status;
});

const handleVideoReady = () => {
  console.log("Vídeo do corredor pronto para tocar.");
  setTimeout(() => {
    videoIsReadyAndVisible.value = true;
  }, 100);
};

const tentarEntrarQuarto = (quarto) => {
  if (quarto.numero === '404') {
    // Quarto 404 sempre vai para o ending se liberado
    if (quarto.liberado) {
      irParaTexto();
    } else {
      portaFechada();
      mostrarModalBloqueio(quarto);
    }
    return;
  }

  if (quarto.liberado) {
    irParaQuarto(quarto.numero);
  } else {
    portaFechada();
    mostrarModalBloqueio(quarto);
  }
};

const mostrarModalBloqueio = (quarto) => {
  // Ativar shake effect
  shakeAtivado.value = true;

  // Adicionar efeito de shake na porta específica
  const portaElement = document.querySelector(`.porta-${quarto.numero}`);
  if (portaElement) {
    portaElement.style.animation = 'shake-door 0.5s ease-in-out';
    setTimeout(() => {
      portaElement.style.animation = '';
    }, 500);
  }

  // Encontrar qual quarto precisa ser completado
  const quartoAnterior = encontrarQuartoRequisito(quarto.numero);

  modalBloqueio.value = {
    ativo: true,
    mensagem: `Você precisa completar os quartos anteriores antes de acessar o Quarto ${quarto.numero}.`,
    quartoRequisito: quartoAnterior,
    quartoTentativa: quarto.numero
  };
};

const encontrarQuartoRequisito = (numeroQuarto) => {
  const quartos = ["401", "402", "403", "404"];
  const indiceAtual = quartos.indexOf(numeroQuarto);

  // Encontra o primeiro quarto não completado antes do atual
  for (let i = 0; i < indiceAtual; i++) {
    const status = statusQuartos.value.find(q => q.numero === quartos[i]);
    if (!status.completado) {
      return quartos[i];
    }
  }

  return quartos[0]; // Fallback para o primeiro quarto
};

const irParaQuartoRequisito = () => {
  fecharModal();
  irParaQuarto(modalBloqueio.value.quartoRequisito);
};

const fecharModal = () => {
  modalBloqueio.value.ativo = false;
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

// Função para forçar atualização do status dos quartos
const forcarAtualizacao = () => {
  atualizacaoForcada.value += 1;
  debugProgresso(); // Mostrar informações de debug no console
};

// Atualizar status quando o componente é montado ou quando volta a ser visível
onMounted(() => {
  console.log("Componente CorredorView montado.");
  forcarAtualizacao();

  // Adicionar evento para atualizar quando a janela recebe foco
  window.addEventListener('focus', forcarAtualizacao);
});

// Limpar event listeners quando o componente é desmontado
onUnmounted(() => {
  window.removeEventListener('focus', forcarAtualizacao);
});

// Adicionar watch para atualizar videoIsReadyAndVisible quando corridorVideoPlayer mudar
watch(corridorVideoPlayer, (newPlayer) => {
  if (newPlayer) {
    newPlayer.addEventListener('canplaythrough', handleVideoReady);
  }
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.porta-bloqueada {
  cursor: not-allowed;
}

.numero {
  display: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.porta:hover .numero {
  display: block;
}

.icone-bloqueado {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  opacity: 0.8;
  color: #ff4444;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone-completado {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #00ff00;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Modal de Bloqueio */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-bloqueio {
  background: linear-gradient(145deg, #2a1a1a, #1a0a0a);
  border: 2px solid #ff4444;
  border-radius: 15px;
  padding: 35px;
  max-width: 550px;
  width: 90%;
  box-shadow:
    0 0 50px rgba(255, 68, 68, 0.4),
    0 0 100px rgba(255, 68, 68, 0.2),
    inset 0 0 30px rgba(0, 0, 0, 0.8);
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
}

.modal-bloqueio::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 68, 68, 0.1), transparent);
  animation: shimmer 2s infinite;
}

.modal-bloqueio::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff4444, transparent);
  animation: pulse-line 1.5s ease-in-out infinite;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: #ff6666;
  font-size: 26px;
  font-weight: bold;
  margin: 0;
  text-shadow:
    0 0 10px rgba(255, 68, 68, 0.8),
    0 0 20px rgba(255, 68, 68, 0.4);
  animation: glow-text 2s ease-in-out infinite alternate;
}

.modal-content {
  text-align: center;
  margin-bottom: 25px;
}

.modal-content p {
  color: #ccc;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.quarto-requisito {
  background: linear-gradient(145deg, rgba(255, 68, 68, 0.15), rgba(255, 68, 68, 0.05));
  border: 2px solid #ff4444;
  border-radius: 8px;
  padding: 15px;
  color: #ff8888;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}

.quarto-requisito::before {
  position: absolute;
  top: -5px;
  right: 10px;
  font-size: 20px;
  opacity: 0.3;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-ir-quarto,
.btn-fechar {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-ir-quarto {
  background: linear-gradient(145deg, #4a5a4f, #3a4a3f);
  color: #fff;
  border: 1px solid #6a7a6f;
}

.btn-ir-quarto:hover {
  background: linear-gradient(145deg, #5a6a5f, #4a5a4f);
  box-shadow: 0 0 15px rgba(106, 122, 111, 0.3);
  transform: translateY(-2px);
}

.btn-fechar {
  background: linear-gradient(145deg, #444, #333);
  color: #ccc;
  border: 1px solid #666;
}

.btn-fechar:hover {
  background: linear-gradient(145deg, #555, #444);
  color: #fff;
  transform: translateY(-2px);
}

/* Debug Button */
.debug-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #00ff41;
  border: 1px solid #00ff41;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  z-index: 100;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.debug-button:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsividade para diferentes tamanhos de tela */
@media (max-width: 768px) {

  .porta-401,
  .porta-402,
  .porta-403,
  .porta-404 {
    width: 15%;
    height: 40%;
  }

  .modal-bloqueio {
    padding: 20px;
    margin: 20px;
  }

  .modal-actions {
    flex-direction: column;
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

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

@keyframes pulse-line {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

@keyframes shake-door {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

@keyframes glow-text {
  from {
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.8), 0 0 20px rgba(255, 68, 68, 0.4);
  }

  to {
    text-shadow: 0 0 15px rgba(255, 68, 68, 1), 0 0 30px rgba(255, 68, 68, 0.6);
  }
}
</style>
