<template>
  <div class="pinpad-screen">
    <!-- Botão de voltar -->
    <button @click="sairPuzzle" class="close-button atmospheric-glow" aria-label="Voltar para a geladeira">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
      </svg>
      <div class="button-aura"></div>
    </button>

    <!-- Layout de duas colunas -->
    <div class="split-layout">
      <!-- Coluna esquerda: Pinpad -->
      <div class="pinpad-column">
        <div class="pinpad-modal enhanced-modal">
          <div class="modal-glow"></div>
          <h3 class="title-enhanced">Digite o código:</h3>
          <div class="inputs-container enhanced-inputs">
            <div v-for="(digit, index) in codigoInput" :key="index" class="digit-control enhanced-digit">
              <button class="arrow-btn enhanced-arrow" @click="incrementDigit(index)">
                <span class="arrow-symbol">▲</span>
                <div class="btn-ripple"></div>
              </button>
              <div class="digit-display enhanced-display">
                <span class="digit-number">{{ digit }}</span>
                <div class="digit-glow"></div>
              </div>
              <button class="arrow-btn enhanced-arrow" @click="decrementDigit(index)">
                <span class="arrow-symbol">▼</span>
                <div class="btn-ripple"></div>
              </button>
            </div>
          </div>
          <div class="actions">
            <button @click="validarCodigo" class="confirm-btn enhanced-confirm">
              <span class="btn-text">Confirmar</span>
              <div class="confirm-glow"></div>
            </button>
          </div>
          <p v-if="erroCodigo" class="error-msg enhanced-error">
            <span class="error-icon">⚠</span>
            Código incorreto. Tente novamente.
            <div class="error-pulse"></div>
          </p>
        </div>
      </div>

      <!-- Coluna direita: Imagem da geladeira aberta -->
      <div class="image-column enhanced-image-col">
        <div class="image-frame">
          <img :src="imagemGeladeira" alt="Geladeira aberta" class="geladeira-img enhanced-img" />
        </div>
      </div>
    </div>
    
    <!-- Efeitos atmosféricos de fundo -->
    <div class="atmospheric-bg">
      <div class="fog-layer fog-1"></div>
      <div class="fog-layer fog-2"></div>
      <div class="fog-layer fog-3"></div>
    </div>

    <!-- Modal de conclusão -->
    <Completo 
      v-if="mostrarCompleto"
      @continuar="irParaCorredor" 
      @fechar="fecharCompleto"
      :autoRedirect="true"
      :redirectDelay="3000"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import successSound from '@/assets/audio/audiosamples/Samples/puzzlesuccess.mp3';
import imagemGeladeira from '@/assets/images/402a.png';
import Completo from '../Completo.vue'

const router = useRouter();
const codigoInput = ref([0, 0, 0]);
const erroCodigo = ref(false);
const codigoCorreto = '154';
const mostrarCompleto = ref(false)

const audioSucesso = new Audio(successSound);

function incrementDigit(index) {
  codigoInput.value[index] = (codigoInput.value[index] + 1) % 10;
  erroCodigo.value = false; // Limpa mensagem de erro ao alterar dígitos
}

function decrementDigit(index) {
  codigoInput.value[index] = (codigoInput.value[index] + 9) % 10;
  erroCodigo.value = false; // Limpa mensagem de erro ao alterar dígitos
}

function validarCodigo() {
  const codigoDigitado = codigoInput.value.join('');
  if (codigoDigitado === codigoCorreto) {
    audioSucesso.play().catch(err => console.warn('Erro ao tocar áudio:', err));
    mostrarCompleto.value = true;
  } else {
    erroCodigo.value = true;
  }
}

function sairPuzzle() {
  // Volta para a geladeira
  router.push('/quarto/402/geladeira');
}

function irParaCorredor() {
  router.push('/corredor');
}

function fecharCompleto() {
  mostrarCompleto.value = false;
}

// Resetar o código ao montar o componente
onMounted(() => {
  codigoInput.value = [0, 0, 0];
  erroCodigo.value = false;
});
</script>

<style scoped>
.pinpad-screen {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(15, 25, 35, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(25, 15, 35, 0.6) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  animation: screenFlicker 8s ease-in-out infinite;
}

/* Efeitos atmosféricos de fundo */
.atmospheric-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.fog-layer {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(100, 80, 120, 0.02) 0%, transparent 70%);
  animation: fogDrift 20s linear infinite;
}

.fog-1 {
  top: -50%;
  left: -50%;
  animation-duration: 25s;
  animation-delay: 0s;
}

.fog-2 {
  top: -30%;
  left: -30%;
  animation-duration: 30s;
  animation-delay: -10s;
  opacity: 0.7;
}

.fog-3 {
  top: -70%;
  left: -70%;
  animation-duration: 35s;
  animation-delay: -20s;
  opacity: 0.5;
}

.split-layout {
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 40px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  padding: 0 40px;
}

.pinpad-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.enhanced-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 40px 0;
  overflow: hidden;
  position: relative;
}

.image-frame {
  position: relative;
  width: 100%;
  max-width: none;
  height: calc(100vh - 80px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(50, 30, 70, 0.3);
  margin: 0;
}

.enhanced-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: 
    contrast(1.05) 
    brightness(1.1) 
    saturate(0.95);
  transition: all 0.8s ease;
}

.image-overlay {
  display: none;
}

.image-vignette {
  display: none;
}

/* Botão de voltar aprimorado */
.atmospheric-glow {
  position: absolute;
  top: 20px;
  left: 20px;
  background: 
    radial-gradient(circle at center, rgba(20, 40, 60, 0.8) 0%, rgba(10, 20, 30, 0.9) 100%);
  border: 1px solid rgba(120, 140, 160, 0.4);
  border-radius: 50%;
  cursor: pointer;
  color: rgba(200, 220, 240, 0.9);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 0 20px rgba(0, 0, 0, 0.7),
    0 0 40px rgba(80, 100, 120, 0.2),
    inset 0 0 15px rgba(0, 0, 0, 0.5);
  animation: buttonPulse 4s ease-in-out infinite;
  overflow: hidden;
}

.button-aura {
  position: absolute;
  inset: -5px;
  background: radial-gradient(circle, rgba(120, 140, 160, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.atmospheric-glow:hover {
  transform: scale(1.1) rotate(5deg);
  color: rgba(220, 240, 255, 1);
  box-shadow: 
    0 0 30px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(120, 140, 180, 0.4),
    inset 0 0 20px rgba(0, 0, 0, 0.6);
}

.atmospheric-glow:hover .button-aura {
  opacity: 1;
}

.atmospheric-glow svg {
  width: 28px;
  height: 28px;
  stroke-width: 2.5;
  stroke: currentColor;
  filter: drop-shadow(0 0 8px rgba(120, 140, 160, 0.3));
  transition: all 0.4s ease;
}

/* Modal aprimorado */
.enhanced-modal {
  background: 
    linear-gradient(135deg, 
      rgba(15, 20, 15, 0.95) 0%, 
      rgba(10, 15, 10, 0.98) 50%, 
      rgba(5, 10, 5, 1) 100%);
  padding: 40px;
  border-radius: 16px;
  min-width: 380px;
  color: rgba(220, 240, 220, 0.95);
  box-shadow: 
    0 0 50px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(30, 60, 30, 0.2),
    inset 0 0 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(60, 120, 60, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.modal-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    rgba(60, 120, 60, 0.1) 0%,
    transparent 25%,
    rgba(30, 80, 30, 0.1) 50%,
    transparent 75%,
    rgba(60, 120, 60, 0.1) 100%
  );
  border-radius: 18px;
  animation: modalGlow 6s ease-in-out infinite;
  z-index: -1;
}

.title-enhanced {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.6rem;
  font-family: 'Orbitron', monospace, sans-serif;
  letter-spacing: 2px;
  text-shadow: 
    0 0 10px rgba(60, 120, 60, 0.5),
    0 0 20px rgba(30, 80, 30, 0.3);
  animation: titleFlicker 8s ease-in-out infinite;
}

.enhanced-inputs {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 25px 0 40px 0;
}

.enhanced-digit {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  position: relative;
}

.enhanced-display {
  font-size: 3.2rem;
  font-weight: bold;
  margin: 12px 0;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  background: 
    linear-gradient(135deg, 
      rgba(5, 15, 5, 0.9) 0%, 
      rgba(10, 25, 10, 0.95) 100%);
  border: 2px solid rgba(60, 120, 60, 0.6);
  border-radius: 8px;
  box-shadow: 
    0 0 15px rgba(60, 120, 60, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.digit-number {
  position: relative;
  z-index: 2;
  text-shadow: 
    0 0 8px rgba(60, 120, 60, 0.8),
    0 0 16px rgba(30, 80, 30, 0.4);
}

.digit-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(60, 120, 60, 0.1) 0%, transparent 70%);
  animation: digitPulse 3s ease-in-out infinite;
}

.enhanced-arrow {
  cursor: pointer;
  border: none;
  background: 
    linear-gradient(135deg, 
      rgba(10, 25, 10, 0.8) 0%, 
      rgba(5, 15, 5, 0.9) 100%);
  font-size: 1.6rem;
  line-height: 1;
  user-select: none;
  padding: 8px 18px;
  color: rgba(180, 220, 180, 0.9);
  border-radius: 6px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 100%;
  border: 1px solid rgba(60, 120, 60, 0.4);
  box-shadow: 
    0 0 10px rgba(0, 0, 0, 0.5),
    inset 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.arrow-symbol {
  position: relative;
  z-index: 2;
  text-shadow: 0 0 6px rgba(60, 120, 60, 0.6);
}

.btn-ripple {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(60, 120, 60, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.enhanced-arrow:hover {
  background: 
    linear-gradient(135deg, 
      rgba(20, 40, 20, 0.9) 0%, 
      rgba(15, 30, 15, 1) 100%);
  transform: scale(1.05) translateY(-2px);
  color: rgba(200, 240, 200, 1);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(60, 120, 60, 0.3),
    inset 0 0 15px rgba(0, 0, 0, 0.4);
}

.enhanced-arrow:hover .btn-ripple {
  opacity: 1;
}

.enhanced-arrow:active {
  transform: scale(0.98) translateY(0);
}

.enhanced-confirm {
  padding: 15px 40px;
  font-size: 1.2em;
  border: none;
  background: 
    linear-gradient(135deg, 
      rgba(10, 25, 10, 0.9) 0%, 
      rgba(5, 15, 5, 1) 100%);
  color: rgba(200, 240, 200, 0.95);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 2px solid rgba(60, 120, 60, 0.5);
  box-shadow: 
    0 0 20px rgba(0, 0, 0, 0.7),
    0 0 40px rgba(60, 120, 60, 0.2),
    inset 0 0 20px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-text {
  position: relative;
  z-index: 2;
  text-shadow: 0 0 8px rgba(60, 120, 60, 0.6);
}

.confirm-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(60, 120, 60, 0.1) 0%,
    transparent 50%,
    rgba(60, 120, 60, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.6s ease;
}

.enhanced-confirm:hover {
  background: 
    linear-gradient(135deg, 
      rgba(20, 40, 20, 1) 0%, 
      rgba(15, 30, 15, 1) 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 6px 25px rgba(0, 0, 0, 0.8),
    0 0 50px rgba(80, 140, 80, 0.3),
    inset 0 0 25px rgba(0, 0, 0, 0.5);
  color: rgba(220, 255, 220, 1);
}

.enhanced-confirm:hover .confirm-glow {
  opacity: 1;
}

.enhanced-confirm:active {
  transform: translateY(-1px) scale(1);
}

.enhanced-error {
  color: rgba(255, 120, 120, 0.95);
  margin-top: 20px;
  font-weight: bold;
  text-align: center;
  background: 
    linear-gradient(135deg, 
      rgba(40, 10, 10, 0.8) 0%, 
      rgba(30, 5, 5, 0.9) 100%);
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid rgba(200, 60, 60, 0.4);
  box-shadow: 
    0 0 20px rgba(200, 60, 60, 0.2),
    inset 0 0 15px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  animation: errorShake 0.5s ease-in-out;
}

.error-icon {
  margin-right: 8px;
  font-size: 1.2em;
  text-shadow: 0 0 8px rgba(255, 120, 120, 0.6);
}

.error-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200, 60, 60, 0.1) 50%,
    transparent 100%
  );
  animation: errorPulse 2s ease-in-out infinite;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
}

/* Animações */
@keyframes screenFlicker {
  0%, 100% { opacity: 1; }
  98% { opacity: 1; }
  99% { opacity: 0.98; }
}

@keyframes fogDrift {
  0% { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
  100% { transform: translateX(-30%) translateY(-30%) rotate(360deg); }
}

@keyframes overlayShift {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes buttonPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(80, 100, 120, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5); }
  50% { box-shadow: 0 0 25px rgba(0, 0, 0, 0.8), 0 0 50px rgba(100, 120, 140, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.6); }
}

@keyframes modalGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes titleFlicker {
  0%, 100% { opacity: 1; }
  97% { opacity: 1; }
  98% { opacity: 0.95; }
  99% { opacity: 1; }
}

@keyframes digitPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes errorPulse {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
  .split-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 20px;
    padding: 0 20px;
  }
  
  .pinpad-column {
    order: 2;
  }
  
  .enhanced-image-col {
    order: 1;
    max-height: 40vh;
  }
  
  .enhanced-modal {
    min-width: unset;
    width: 90%;
    padding: 30px 20px;
  }
  
  .enhanced-inputs {
    gap: 20px;
  }
  
  .enhanced-display {
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 2.8rem;
  }
}
</style>
