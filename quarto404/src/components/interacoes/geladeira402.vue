<template>
  <div class="geladeira-overlay">
    <div class="geladeira-container">
      <img :src="imagemGeladeira" class="geladeira-img" />
      
      <!-- Área clicável para o pinpad -->
      <div class="pinpad-area" @click="abrirPinpad"></div>
      
      <!-- Botão de fechar -->
      <button class="fechar-btn" @click="voltarParaQuarto">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import imagemGeladeira from '@/assets/images/402a.png';

const router = useRouter();

const abrirPinpad = () => {
  router.push('/quarto/402/pinpad'); 
};

const voltarParaQuarto = () => {
  router.push('/quarto/402'); 
};

</script>

<style scoped>
.geladeira-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.geladeira-container {
  position: relative;
  width: 80%;
  max-width: 960px;
  max-height: 90vh;
  border: 2px solid #444;
  border-radius: 8px;
  background-color: #000;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.geladeira-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.pinpad-area {
  position: absolute;
  /* Ajuste estas coordenadas para a posição exata do pinpad na imagem */
  top: 40%; 
  left: 55%;
  width: 40%;
  height: 30%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  /* Descomente para visualizar a área durante desenvolvimento */
  /* border: 2px solid rgba(255, 255, 0, 0.3); */
}

.fechar-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 8px 16px;
  background: rgba(20, 20, 20, 0.8);
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
}

.fechar-btn:hover {
  background: rgba(40, 40, 40, 0.9);
  transform: translateY(-1px);
}

.fechar-btn:active {
  transform: translateY(1px);
}
</style>