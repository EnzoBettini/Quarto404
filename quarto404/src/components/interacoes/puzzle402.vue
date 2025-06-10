<template>
  <div>
    <div v-if="!pinPadVisivel" class="puzzle-container">
      <button @click="sairPuzzle" class="close-button" aria-label="Fechar puzzle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <img :src="img402a" alt="Puzzle 402" class="puzzle-image" />

      <button @click="abrirPinPad" class="open-pinpad-button" aria-haspopup="dialog" :aria-expanded="pinPadVisivel.toString()">
        Abrir Pin Pad
      </button>
    </div>

    <div v-if="pinPadVisivel" class="pinpad-backdrop" @click.self="fecharPinPad">
      <div class="pinpad-modal" role="dialog" aria-modal="true" @click.stop>
        <!-- PinPad inputs here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import successSound from '@/assets/audio/audiosamples/Samples/puzzlesuccess.mp3';
import img402a from '@/assets/images/402a.png';

const emit = defineEmits(['exit', 'success']);

const pinPadVisivel = ref(false);
const codigoInput = ref([0, 0, 0]);
const erroCodigo = ref(false);
const codigoCorreto = '154';

const audioSucesso = new Audio(successSound);

function abrirPinPad() {
  pinPadVisivel.value = true;
  erroCodigo.value = false;
  codigoInput.value = [0, 0, 0];
}

function fecharPinPad() {
  pinPadVisivel.value = false;
  erroCodigo.value = false;
  codigoInput.value = [0, 0, 0];
}

function incrementDigit(index) {
  codigoInput.value[index] = (codigoInput.value[index] + 1) % 10;
}

function decrementDigit(index) {
  codigoInput.value[index] = (codigoInput.value[index] - 1 + 10) % 10;
}

function validarCodigo() {
  const codigoDigitado = codigoInput.value.join('');
  if (codigoDigitado === codigoCorreto) {
    audioSucesso.play().catch(err => console.warn('Erro ao tocar áudio:', err));
    emit('success');
    fecharPinPad();
  } else {
    erroCodigo.value = true;
  }
}

function sairPuzzle() {
  emit('exit');
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && pinPadVisivel.value) {
    fecharPinPad();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.puzzle-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 20px;
  pointer-events: auto;
  min-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.puzzle-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 20px;
  left: -20px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-button:hover {
  color: #38b000;
}
.close-button svg {
  width: 24px;
  height: 24px;
  stroke-width: 3;
  stroke: currentColor;
}

.open-pinpad-button {
  background-color: #0d3d0d;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.open-pinpad-button:hover {
  background-color: #145214;
}

.pinpad-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: auto;
}

.pinpad-modal {
  background: #191a19;
  padding: 20px;
  pointer-events: auto;
  border-radius: 8px;
  min-width: 300px;
  color: white;
}
</style>
