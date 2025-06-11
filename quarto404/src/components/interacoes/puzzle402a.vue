<template>
  <div class="fullscreen-image">
    <img :src="sceneImage" alt="Cena 402B" />
    <button class="exit-btn" @click="fecharCena">Fechar Cena</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import sceneImage from '@/assets/images/402b.png';

const router = useRouter();

function fecharCena() {
  // Volta diretamente para o quarto 402
  router.push('/quarto/402');
}
</script>


<style scoped>
.fullscreen-image {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

.exit-btn {
  position: absolute; /* or fixed */
  top: 20px;
  right: 20px;
  z-index: 1000; /* HIGHER than pegar chave button */
  padding: 10px 15px;
  background: #0d3d0d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.exit-btn:hover {
  background: #145214;
}
</style>
