<template>
  <div class="sala403">
    <!-- Caixa transparente com bordas para abrir o puzzle -->
    <div
      class="puzzle-trigger"
      @click="mostrarPuzzle = true"
      v-if="!mostrarPuzzle && !liberou"
    >
      Clique aqui para resolver o puzzle
    </div>

    <!-- Componente do puzzle -->
    <CablePuzzle
      v-if="mostrarPuzzle"
      @puzzle-solved="resolverPuzzle"
    />

    <!-- Confirmação -->
    <p v-if="liberou">✅ Puzzle resolvido! Você pode interagir com a TV agora.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CablePuzzle from './CabblePuzzle.vue'


const mostrarPuzzle = ref(false)
const liberou = ref(false)

function resolverPuzzle() {
  liberou.value = true
  mostrarPuzzle.value = false
}
</script>

<style scoped>
.sala403 {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Caixa transparente com borda */
.puzzle-trigger {
  position: absolute;
  top: 100px; /* ajuste conforme o local desejado */
  left: 100px; /* ajuste conforme o local desejado */
  width: 200px;
  height: 200px;
  border: 3px dashed red;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
