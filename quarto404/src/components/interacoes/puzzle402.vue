<template>
  <div class="puzzle-container">
    <!-- Return Arrow Button -->
    <button @click="sairPuzzle" class="close-button" aria-label="Fechar puzzle">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Open Pin Pad Button -->
    <button @click="abrirPinPad" class="open-pinpad-button">Abrir Pin Pad</button>

    <!-- Pin Pad Modal -->
    <div v-if="pinPadVisivel" class="pinpad-backdrop" @click.self="fecharPinPad">
      <div class="pinpad-modal" @click.stop>
        <h3>Digite o código:</h3>
        <div class="inputs-container">
          <div v-for="(digit, index) in codigoInput" :key="index" class="digit-control">
            <button class="arrow-btn" @click="incrementDigit(index)">▲</button>
            <div class="digit-display">{{ digit }}</div>
            <button class="arrow-btn" @click="decrementDigit(index)">▼</button>
          </div>
        </div>
        <div class="actions">
          <button @click="validarCodigo">Confirmar</button>
          <button @click="fecharPinPad">Cancelar</button>
        </div>
        <p v-if="erroCodigo" class="error-msg">Código incorreto. Tente novamente.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import successSound from '@/assets/audio/audiosamples/Samples/puzzlesuccess.mp3';

const emit = defineEmits(['exit']);

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
  codigoInput.value[index] = (codigoInput.value[index] + 9) % 10;
}

function validarCodigo() {
  const codigoDigitado = codigoInput.value.join('');
  if (codigoDigitado === codigoCorreto) {
    audioSucesso.play().catch(err => console.warn('Erro ao tocar áudio:', err));
    fecharPinPad();
  } else {
    erroCodigo.value = true;
  }
}

function sairPuzzle() {
  emit('exit');
}
</script>

<style scoped>
.puzzle-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 20px;
  z-index: 10;
  border-radius: 8px;
  pointer-events: auto;
  min-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

/* Return Arrow */
.close-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
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
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-100px);
}

.pinpad-modal {
  background: #191a19;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  color: white;
}

.inputs-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 10px 0 20px 0;
}

.digit-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}

.digit-display {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 8px 0;
  width: 40px;
  text-align: center;
}

.arrow-btn {
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  user-select: none;
  padding: 2px 5px;
  color: #0d3d0d;
  transition: color 0.2s ease;
}
.arrow-btn:hover {
  color: #38b000;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.actions button {
  padding: 8px 15px;
  font-size: 1em;
  border: none;
  background-color: #0d3d0d;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.actions button:hover {
  background-color: #145214;
}

.error-msg {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
