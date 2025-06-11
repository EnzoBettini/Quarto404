<template>
  <div class="completo-overlay" @click="fecharModal">
    <div class="completo-modal" @click.stop>
      <div class="modal-atmosphere">
        <div class="success-glow"></div>
        <div class="floating-particles">
          <div v-for="i in 12" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      
      <div class="modal-content">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 class="success-title">Puzzle Resolvido!</h2>
        
        <div class="message-container">
          <p class="success-message">
            O código foi aceito com sucesso.
          </p>
          <p class="redirect-message">
            Você está sendo redirecionado para o corredor...
          </p>
          <p class="next-info">
            Agora você pode explorar o próximo quarto.
          </p>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">Carregando...</span>
        </div>
        
        <button @click="continuarJogo" class="continue-btn">
          <span class="btn-text">Continuar</span>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['continuar', 'fechar'])

const props = defineProps({
  autoRedirect: {
    type: Boolean,
    default: true
  },
  redirectDelay: {
    type: Number,
    default: 3000
  }
})

const isVisible = ref(true)

const getParticleStyle = (index) => {
  const delay = Math.random() * 3
  const duration = 4 + Math.random() * 2
  const size = 2 + Math.random() * 4
  
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  }
}

const continuarJogo = () => {
  emit('continuar')
  fecharModal()
}

const fecharModal = () => {
  isVisible.value = false
  setTimeout(() => {
    emit('fechar')
  }, 300)
}

onMounted(() => {
  if (props.autoRedirect) {
    setTimeout(() => {
      continuarJogo()
    }, props.redirectDelay)
  }
})
</script>

<style scoped>
.completo-overlay {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 40%, rgba(20, 40, 20, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(40, 20, 60, 0.6) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(10, 20, 10, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: overlayFadeIn 0.6s ease-out;
}

.completo-modal {
  background: 
    linear-gradient(135deg, 
      rgba(15, 25, 15, 0.95) 0%, 
      rgba(10, 20, 10, 0.98) 50%, 
      rgba(5, 15, 5, 1) 100%);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 60px rgba(0, 0, 0, 0.9),
    0 0 120px rgba(40, 80, 40, 0.3),
    inset 0 0 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(80, 160, 80, 0.4);
  animation: modalSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.success-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(
    45deg,
    rgba(80, 160, 80, 0.2) 0%,
    transparent 30%,
    rgba(40, 120, 40, 0.15) 50%,
    transparent 70%,
    rgba(80, 160, 80, 0.2) 100%
  );
  border-radius: 22px;
  animation: successPulse 4s ease-in-out infinite;
}

.floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(120, 200, 120, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

.modal-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: rgba(220, 255, 220, 0.95);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  background: 
    radial-gradient(circle, 
      rgba(40, 120, 40, 0.8) 0%, 
      rgba(20, 80, 20, 0.9) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 30px rgba(80, 160, 80, 0.4),
    inset 0 0 20px rgba(0, 0, 0, 0.3);
  animation: iconPulse 2s ease-in-out infinite;
}

.success-icon svg {
  width: 50px;
  height: 50px;
  stroke: rgba(180, 255, 180, 0.9);
  filter: drop-shadow(0 0 10px rgba(120, 200, 120, 0.6));
}

.success-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  font-family: 'Orbitron', monospace, sans-serif;
  letter-spacing: 2px;
  text-shadow: 
    0 0 15px rgba(80, 160, 80, 0.6),
    0 0 30px rgba(40, 120, 40, 0.4);
  animation: titleGlow 3s ease-in-out infinite;
}

.message-container {
  margin-bottom: 35px;
  line-height: 1.6;
}

.success-message {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: rgba(200, 255, 200, 0.9);
  text-shadow: 0 0 8px rgba(80, 160, 80, 0.4);
}

.redirect-message {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: rgba(180, 240, 180, 0.8);
  font-style: italic;
}

.next-info {
  font-size: 1rem;
  color: rgba(160, 220, 160, 0.7);
  font-weight: 300;
}

.progress-container {
  margin-bottom: 30px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(80, 160, 80, 0.8) 0%,
    rgba(120, 200, 120, 0.9) 50%,
    rgba(80, 160, 80, 0.8) 100%
  );
  border-radius: 3px;
  animation: progressFill 3s ease-out forwards;
  box-shadow: 0 0 10px rgba(80, 160, 80, 0.5);
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(160, 220, 160, 0.7);
  font-family: monospace;
  letter-spacing: 1px;
}

.continue-btn {
  background: 
    linear-gradient(135deg, 
      rgba(20, 60, 20, 0.9) 0%, 
      rgba(10, 40, 10, 1) 100%);
  border: 2px solid rgba(80, 160, 80, 0.6);
  border-radius: 12px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(220, 255, 220, 0.95);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 0 25px rgba(0, 0, 0, 0.7),
    0 0 50px rgba(80, 160, 80, 0.2),
    inset 0 0 20px rgba(0, 0, 0, 0.4);
}

.btn-text {
  position: relative;
  z-index: 2;
  text-shadow: 0 0 10px rgba(80, 160, 80, 0.6);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(80, 160, 80, 0.1) 0%,
    transparent 50%,
    rgba(80, 160, 80, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.6s ease;
}

.continue-btn:hover {
  transform: translateY(-3px) scale(1.02);
  background: 
    linear-gradient(135deg, 
      rgba(30, 80, 30, 1) 0%, 
      rgba(20, 60, 20, 1) 100%);
  box-shadow: 
    0 6px 30px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(100, 180, 100, 0.3),
    inset 0 0 25px rgba(0, 0, 0, 0.5);
  color: rgba(240, 255, 240, 1);
}

.continue-btn:hover .btn-glow {
  opacity: 1;
}

.continue-btn:active {
  transform: translateY(-1px) scale(1);
}

/* Animações */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    opacity: 0; 
    transform: translateY(-50px) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes successPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
    opacity: 0.3; 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 0.8; 
  }
}

@keyframes iconPulse {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 30px rgba(80, 160, 80, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.3); 
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 40px rgba(80, 160, 80, 0.6), inset 0 0 25px rgba(0, 0, 0, 0.4); 
  }
}

@keyframes titleGlow {
  0%, 100% { 
    text-shadow: 0 0 15px rgba(80, 160, 80, 0.6), 0 0 30px rgba(40, 120, 40, 0.4); 
  }
  50% { 
    text-shadow: 0 0 20px rgba(80, 160, 80, 0.8), 0 0 40px rgba(40, 120, 40, 0.6); 
  }
}

@keyframes progressFill {
  from { width: 0%; }
  to { width: 100%; }
}

/* Responsividade */
@media (max-width: 768px) {
  .completo-modal {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .success-title {
    font-size: 1.8rem;
  }
  
  .success-message {
    font-size: 1.1rem;
  }
  
  .continue-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
