<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { membros } from '@/assets/data/membros.js';
import startSoundFile from '@/assets/audio/audiosamples/Samples/simpleboom.wav';

const router = useRouter();
const activeIndex = ref(0);

const returnToMenu = () => {
  try {
    const audio = new Audio(startSoundFile);
    audio.volume = 0.1;
    audio.play();
  } catch (error) {
    console.error("Erro ao tocar som:", error);
  }
  router.push('/');
};

const selectMember = (index) => {
  activeIndex.value = index;
};

let interval;

onMounted(() => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % membros.length;
  }, 4000);
});

const cleanup = () => {
  clearInterval(interval);
};

</script>

<template>
  <div class="container">
    <div class="background"></div>
    
    <div class="content">
      <h1 class="title">CRÉDITOS</h1>
      <p class="subtitle">> EQUIPE QUARTO 404</p>

      <div class="members">
        <div 
          v-for="(membro, index) in membros" 
          :key="index"
          class="card"
          @click="selectMember(index)"
          :class="{ active: index === activeIndex }"
        >
          <h3>{{ membro.nome }}</h3>
          <div class="social-buttons">
            <a :href="membro.github" target="_blank" class="social-btn github">
              <span class="icon">&#xf09b;</span>
              <span class="label">GitHub</span>
            </a>
            <a :href="membro.linkedin" target="_blank" class="social-btn linkedin">
              <span class="icon">&#xf08c;</span>
              <span class="label">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      <div class="dots">
        <span 
          v-for="(_, index) in membros" 
          :key="index"
          class="dot"
          :class="{ active: index === activeIndex }"
          @click="selectMember(index)"
        ></span>
      </div>

      <button @click="returnToMenu" class="return">RETORNAR</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.container {
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #00ff88;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', monospace;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,255,136,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: matrix 20s linear infinite;
  z-index: -1;
}

.content {
  background: rgba(0,20,10,0.9);
  border: 1px solid #00ff88;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2), inset 0 0 15px rgba(0, 255, 136, 0.1);
}

.title {
  font-size: 3rem;
  margin: 0 0 10px 0;
  color: #00ff88;
  text-shadow: 0 0 10px #00ff88;
  font-family: 'Press Start 2P', cursive;
  letter-spacing: 2px;
}

.subtitle {
  margin: 0 0 30px 0;
  font-size: 1.1rem;
  opacity: 0.8;
}

.members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: rgba(0,30,20,0.8);
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 25px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
  transition: left 0.5s;
  z-index: 1;
}

.card:hover::before {
  left: 100%;
}

.card.active {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
  background: rgba(0,40,30,0.9);
}

.card h3 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
}

.social-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.social-btn {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  max-width: 120px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.social-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  transform: rotate(45deg);
  z-index: 0;
}

.social-btn .icon {
  font-family: 'FontAwesome';
  margin-right: 6px;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
}

.social-btn .label {
  position: relative;
  z-index: 1;
}

.github {
  background: linear-gradient(135deg, #333333, #1a1a1a);
  color: #00ff88;
  border: 1px solid #00cc66;
}

.github:hover {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.4);
}

.linkedin {
  background: linear-gradient(135deg, #0077b5, #005582);
  color: white;
  border: 1px solid #0077b5;
}

.linkedin:hover {
  background: linear-gradient(135deg, #0088cc, #0077b5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 119, 181, 0.4);
}

.dots {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #00ff88;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
}

.return {
  background: transparent;
  color: #00ff88;
  border: 1px solid #00ff88;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.return::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
  transition: left 0.5s;
}

.return:hover {
  background: #00ff88;
  color: #000;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
}

.return:hover::before {
  left: 100%;
}

@keyframes matrix {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .members {
    grid-template-columns: 1fr;
  }
  
  .content {
    padding: 30px 20px;
  }
  
  .social-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .social-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .social-btn {
    max-width: 100%;
  }
}
</style>