<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import videoFile from '@/assets/videos/404_inicio.mp4';

const router = useRouter();
const videoPlayer = ref(null);
const escapeButton = ref(null);
const currentScale = ref(1);
const isButtonVisible = ref(true);
let hideButtonTimer = null;

const handleVideoEnd = () => {
    router.push({ name: 'text' });
};

// --- FUNÇÃO DO BOTÃO ALTERADA ---
const handleButtonClick = () => {
    // 1. Aumenta a escala geral do botão
    currentScale.value += 0.03; // Diminuí um pouco o incremento para equilibrar com o novo efeito

    // 2. Lógica para acionar a animação de "shake"
    const buttonEl = escapeButton.value;
    if (buttonEl) {
        // Adiciona a classe que contém a animação
        buttonEl.classList.add('shake-it');

        // "Ouve" o fim da animação para remover a classe.
        // Isto é um truque essencial para permitir que a animação seja reativada no próximo clique.
        buttonEl.addEventListener('animationend', () => {
            buttonEl.classList.remove('shake-it');
        }, { once: true }); // { once: true } faz o "ouvinte" se auto-remover após ser usado.
    }
};

// --- Ciclo de Vida (sem alterações) ---
onMounted(() => {
    videoPlayer.value.play().catch(error => console.error("Erro ao tocar vídeo:", error));
    videoPlayer.value.volume = 0.1;
    videoPlayer.value.addEventListener('ended', handleVideoEnd);
    videoPlayer.value.addEventListener('loadedmetadata', () => {
        const videoDuration = videoPlayer.value.duration;
        const hideTime = (videoDuration - 2.5) * 1000;
        if (hideTime > 0) {
            hideButtonTimer = setTimeout(() => { isButtonVisible.value = false; }, hideTime);
        }
    });
});

onUnmounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.removeEventListener('ended', handleVideoEnd);
        videoPlayer.value.volume = 0.1;

    }
    if (hideButtonTimer) {
        clearTimeout(hideButtonTimer);
    }
});
</script>

<template>
    <div class="video-container">
        <video ref="videoPlayer" :src="videoFile" autoplay playsinline></video>
        <button v-if="isButtonVisible" ref="escapeButton" class="escape-button" @click="handleButtonClick"
            :style="{ transform: `translate(-50%, -50%) scale(${currentScale})` }">
            CLIQUE O MAIS RÁPIDO POSSÍVEL PARA ESCAPAR
        </button>
    </div>
</template>

<style scoped>
@import url('https: //fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&display=swap');

/* ... .video-container e video (sem alterações) ... */
.video-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


/* --- ESTILO DO BOTÃO ALTERADO --- */
.escape-button {
    position: absolute;
    top: 75%;
    left: 50%;
    padding: 15px 25px;
    background-color: rgba(10, 0, 0, 0.5);
    /* Fundo mais escuro */
    border: 1px solid rgba(255, 0, 0, 0.4);
    color: rgba(255, 150, 150, 0.8);
    font-family: 'Orbitron', monospace;
    font-size: 1.5rem;
    letter-spacing: 3px;
    cursor: pointer;
    border-radius: 3px;
    /* Bordas mais retas */
    text-align: center;
    /* Sombra mais difusa e ameaçadora */
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 10px rgba(255, 0, 0, 0.2);
    /* Text-shadow para um efeito de "sangramento" do texto */
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.5), 0 0 8px rgba(255, 0, 0, 0.7);
    transition: opacity 0.5s ease-in-out;
    /* IMPORTANTE: Removemos a transição do transform para que o shake seja imediato */
}

/* NOVO: Efeito de "pressão" ao manter o botão clicado */
.escape-button:active {
    /* Encolhe um pouco e o brilho inverte (inset), dando feedback de pressão */
    transform: scale(0.98) !important;
    /* !important para sobrepor o scale da ref */
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 15px rgba(255, 0, 0, 0.5);
}

/* NOVO: Classe que aplica a animação de tremor/glitch */
.escape-button.shake-it {
    animation: shake-and-glitch 0.4s cubic-bezier(.36, .07, .19, .97);
}

/* NOVO: Animação de tremor e glitch */
@keyframes shake-and-glitch {

    10%,
    90% {
        transform: translate(-1px, 0px) scale(1);
    }

    20%,
    80% {
        transform: translate(2px, 2px) scale(1);
    }

    30%,
    50%,
    70% {
        transform: translate(-4px, -3px) scale(1);
        color: #fff;
    }

    40%,
    60% {
        transform: translate(4px, 3px) scale(1);
    }

    85% {
        transform: translate(0px, 5px) scale(1);
        color: rgba(255, 150, 150, 0.8);
    }
}
</style>
