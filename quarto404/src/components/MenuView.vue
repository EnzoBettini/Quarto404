<template>
  <div class="menu-container">
    <div class="matrix-bg"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>
    
    <video ref="backgroundVideoPlayer" class="background-video" :src="videoSource" loop muted playsinline
      poster="@/assets/videos/elevator_edited.mp4"></video>

    <div class="corner-decorations">
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
    </div>
    
    <div class="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle()"></div>
    </div>

    <div class="overlay-content" :class="{ 'video-playing': isVideoPlaying }">
      <div class="title-container">
        <div class="glitch-container">
          <h1 class="game-title" data-text="QUARTO 404">QUARTO 404</h1>
        </div>
      </div>

      <div v-if="!isVideoPlaying" class="menu-buttons">
        <button @click="startGame" class="game-button start-button">
          <span class="button-text">COMEÇAR JOGO</span>
          <span class="button-glow"></span>
        </button>
        
        <button @click="goToCredits" class="game-button">
          <span class="button-text">CRÉDITOS</span>
          <span class="button-glow"></span>
        </button>
      </div>

      <div class="terminal-info">
        <div class="terminal-line">
          <span class="prompt">></span>
          <span class="text">SISTEMA CORROMPIDO</span>
        </div>
        <div class="terminal-line">
          <span class="prompt">></span>
          <span class="text">REALIDADE INSTÁVEL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import elevatorVideo from '@/assets/videos/elevator_edited.mp4';
import startSoundFile from '@/assets/audio/audiosamples/Samples/simpleboom.wav';

const router = useRouter();
const backgroundVideoPlayer = ref(null);
const videoSource = ref(elevatorVideo);
const isVideoPlaying = ref(false);

const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's'
  };
};

const startGame = () => {
  try {
    const audio = new Audio(startSoundFile);
    audio.play().catch(error => {
      console.error("Erro ao tentar tocar o som de início:", error);
    });
  } catch (error) {
    console.error("Erro ao criar o objeto de áudio:", error);
  }

  if (backgroundVideoPlayer.value) {
    isVideoPlaying.value = true;

    backgroundVideoPlayer.value.muted = false;
    backgroundVideoPlayer.value.loop = false;
    backgroundVideoPlayer.value.currentTime = 0;

    backgroundVideoPlayer.value.play()
      .then(() => {
        console.log("Vídeo de introdução iniciado.");
      })
      .catch(error => {
        console.error("Erro ao tentar tocar o vídeo de introdução:", error);
        router.push('/corredor');
      });
  }
};

const goToCredits = () => {
  try {
    const audio = new Audio(startSoundFile);
    audio.play().catch(error => {
      console.error("Erro ao tentar tocar o som:", error);
    });
  } catch (error) {
    console.error("Erro ao criar o objeto de áudio:", error);
  }
  
  router.push('/creditos');
};

onMounted(() => {
  if (backgroundVideoPlayer.value) {
    backgroundVideoPlayer.value.addEventListener('ended', () => {
      if (isVideoPlaying.value) {
        console.log("Vídeo de introdução terminou.");
        router.push('/corredor');
      }
    });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&display=swap');

:root {
  --neon-green: #00ff88;
  --neon-green-glow: 0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88;
  --dark-green: #003322;
  --blood-red: #8b0000;
  --dark-red: #4a0000;
  --bg-color: #0a0a0a;
}

.menu-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-color);
  color: var(--neon-green);
  font-family: 'Orbitron', monospace;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.5;
  transition: opacity 0.5s ease, filter 0.5s ease;
}

.menu-container.video-playing .background-video {
  opacity: 1;
  filter: none;
}

.matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 10, 5, 0.7), rgba(0, 10, 5, 0.7)),
              url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-2.24 3-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300ff88' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  z-index: 1;
  opacity: 0.8;
  transition: opacity 0.5s ease;
}

.menu-container.video-playing .matrix-bg {
  opacity: 0;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.menu-container.video-playing .particles {
  opacity: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--neon-green);
  border-radius: 50%;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px var(--neon-green);
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  animation: scanline-move 8s linear infinite;
  transition: opacity 0.5s ease;
}

.menu-container.video-playing .scanlines {
  opacity: 0;
}

.noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  animation: noise 0.2s infinite;
  transition: opacity 0.5s ease;
}

.menu-container.video-playing .noise {
  opacity: 0;
}

.corner-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.menu-container.video-playing .corner-decorations {
  opacity: 0;
}

.corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid var(--neon-green);
  box-shadow: 0 0 10px var(--neon-green);
  animation: corner-pulse 4s infinite alternate;
}

.corner.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
  animation-delay: 0s;
}

.corner.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
  animation-delay: 1s;
}

.corner.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
  animation-delay: 2s;
}

.corner.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
  animation-delay: 3s;
}

.overlay-content {
  position: relative;
  z-index: 5;
  width: 480px;
  max-width: 90%;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 20, 10, 0.8) 0%, rgba(0, 30, 20, 0.7) 50%, rgba(0, 20, 10, 0.8) 100%);
  border: 1px solid var(--neon-green);
  border-radius: 8px;
  padding: 40px 30px;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2), inset 0 0 15px rgba(0, 255, 136, 0.1);
  transition: all 0.5s ease-in-out;
  animation: content-float 6s ease-in-out infinite;
}

.overlay-content.video-playing {
  opacity: 0;
  transform: scale(0.9);
  pointer-events: none;
}

.title-container {
  margin-bottom: 35px;
  position: relative;
}

.glitch-container {
  position: relative;
  display: inline-block;
}

.game-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 3.2rem;
  color: var(--neon-green);
  text-shadow: var(--neon-green-glow);
  margin: 0;
  letter-spacing: 2px;
  position: relative;
  animation: title-glow 2s ease-in-out infinite alternate;
}

.game-title::before,
.game-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-title::before {
  left: 2px;
  text-shadow: -1px 0 var(--blood-red);
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.game-title::after {
  left: -2px;
  text-shadow: 1px 0 #00ffff;
  animation: glitch-2 3s infinite linear alternate-reverse;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.game-button {
  position: relative;
  font-family: 'Orbitron', monospace;
  width: 250px;
  max-width: 100%;
  background-color: rgba(0, 30, 20, 0.7);
  color: var(--neon-green);
  border: 1px solid var(--neon-green);
  border-radius: 4px;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  overflow: hidden;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.3), transparent);
  transition: left 0.5s;
  z-index: 1;
}

.game-button:hover {
  background-color: rgba(0, 60, 40, 0.8);
  color: #ffffff;
  border-color: #00ffaa;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4), inset 0 0 10px rgba(0, 255, 136, 0.2);
  transform: translateY(-2px);
  letter-spacing: 1.5px;
}

.game-button:hover .button-glow {
  left: 100%;
}

.game-button:active {
  transform: translateY(0);
}

.start-button {
  animation: pulse-button 2s infinite alternate;
}

.terminal-info {
  font-family: 'Orbitron', monospace;
  font-size: 0.9rem;
  color: #00cc66;
  text-align: left;
  margin-top: 20px;
}

.terminal-line {
  margin: 5px 0;
  opacity: 0.8;
}

.prompt {
  color: var(--neon-green);
  margin-right: 8px;
  animation: blink 1s step-end infinite;
}

.text {
  animation: text-distort 5s infinite;
}

@keyframes title-glow {
  0% {
    text-shadow: 
      0 0 5px var(--neon-green),
      0 0 10px var(--neon-green),
      0 0 15px var(--neon-green);
  }
  100% {
    text-shadow: 
      0 0 8px var(--neon-green),
      0 0 15px var(--neon-green),
      0 0 25px var(--neon-green),
      0 0 35px var(--neon-green);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes corner-pulse {
  0% {
    box-shadow: 0 0 5px var(--neon-green);
  }
  100% {
    box-shadow: 0 0 15px var(--neon-green);
  }
}

@keyframes content-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes glitch-1 {
  0% {
    clip-path: inset(80% 0 0 0);
    transform: translate(-1px, 1px);
  }
  20% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(1px, -1px);
  }
  40% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(1px, 1px);
  }
  60% {
    clip-path: inset(30% 0 70% 0);
    transform: translate(-1px, -1px);
  }
  80% {
    clip-path: inset(70% 0 10% 0);
    transform: translate(-1px, 1px);
  }
  100% {
    clip-path: inset(0 0 90% 0);
    transform: translate(1px, -1px);
  }
}

@keyframes glitch-2 {
  0% {
    clip-path: inset(30% 0 60% 0);
    transform: translate(1px, -1px);
  }
  20% {
    clip-path: inset(60% 0 10% 0);
    transform: translate(-1px, 1px);
  }
  40% {
    clip-path: inset(20% 0 80% 0);
    transform: translate(1px, 1px);
  }
  60% {
    clip-path: inset(80% 0 20% 0);
    transform: translate(-1px, -1px);
  }
  80% {
    clip-path: inset(10% 0 70% 0);
    transform: translate(1px, -1px);
  }
  100% {
    clip-path: inset(40% 0 50% 0);
    transform: translate(-1px, 1px);
  }
}

@keyframes pulse-button {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  }
  100% {
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5), inset 0 0 10px rgba(0, 255, 136, 0.2);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes scanline-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100vh;
  }
}

@keyframes noise {
  0%, 100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-1%, -1%);
  }
  20% {
    transform: translate(1%, 1%);
  }
  30% {
    transform: translate(-1%, 1%);
  }
  40% {
    transform: translate(1%, -1%);
  }
  50% {
    transform: translate(-1%, 0%);
  }
  60% {
    transform: translate(1%, 0%);
  }
  70% {
    transform: translate(0%, 1%);
  }
  80% {
    transform: translate(0%, -1%);
  }
  90% {
    transform: translate(-1%, -1%);
  }
}

@keyframes text-distort {
  0%, 100% {
    transform: skew(0deg, 0deg);
    opacity: 0.8;
  }
  25% {
    transform: skew(1deg, 0.5deg);
    opacity: 1;
  }
  50% {
    transform: skew(-0.5deg, 1deg);
    opacity: 0.8;
  }
  75% {
    transform: skew(0.5deg, -0.5deg);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .game-title {
    font-size: 2.5rem;
  }
  
  .game-button {
    width: 220px;
    font-size: 1rem;
    padding: 12px 15px;
  }
  
  .corner {
    width: 40px;
    height: 40px;
  }
  
  .overlay-content {
    padding: 30px 25px;
    width: 420px;
  }
  
  .terminal-info {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 2rem;
  }
  
  .game-button {
    width: 200px;
    font-size: 0.9rem;
  }
  
  .overlay-content {
    width: 340px;
    padding: 25px 20px;
  }
}
</style>