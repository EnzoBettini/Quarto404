<template>
  <div>
    <div v-if="!puzzleVisivel" class="item-container" @click="abrirPuzzle">
      <Overlay nome="televisao_401" />
    </div>

    <puzzle401 v-if="puzzleVisivel" @exit="fecharPuzzle" />

    <div v-if="puzzleVisivel" class="modal-backdrop"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Overlay from '../efeitos/Overlay.vue';
import puzzle401 from './puzzle401.vue'; // Certifique-se que o nome do arquivo está correto

// --- A LÓGICA DE CONTROLE ---

// Criamos nossa variável de estado. Começa como 'false' (o puzzle está escondido).
const puzzleVisivel = ref(false);

// Função que será chamada pelo @click
const abrirPuzzle = () => {
  puzzleVisivel.value = true; // Muda o estado para 'true', fazendo o puzzle aparecer.
};

// Função que será chamada pelo @exit do puzzle
const fecharPuzzle = () => {
  puzzleVisivel.value = false; // Muda o estado para 'false', escondendo o puzzle.
};
</script>

<style scoped>
/* O .item-container é o posicionador do nosso Overlay */
.item-container {
  position: absolute;
  top: -420%;
  left: 12%; /* Ajuste para a posição vertical */
   /* Ajuste para a posição horizontal */
  transform: translate(-50%, -50%);
  width: 13vw; /* Tamanho do item clicável */

  cursor: pointer;
  pointer-events: auto; /* Garante que seja clicável */

  border: 3px solid transparent;
  border-radius: 8px;
  transition: border-color 0.2s ease-in-out;
}

.item-container:hover {
  border-color: #a7a7a777;
}

/* Estilo para o fundo que escurece e bloqueia a tela */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9; /* Fica abaixo do puzzle (z-index 10), mas acima do resto */
}
</style>