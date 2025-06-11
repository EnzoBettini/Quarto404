<script setup>
import { useRouter } from 'vue-router';
import { membros } from '@/assets/data/membros.js';
import startSoundFile from '@/assets/audio/audiosamples/Samples/simpleboom.wav';

const router = useRouter();

// Função para tocar o som e voltar ao menu principal
const returnToMenu = () => {
    try {
        const audio = new Audio(startSoundFile);
        audio.play();
    } catch (error) {
        console.error("Erro ao tocar som:", error);
    }
    router.push('/');
};
</script>

<template>
    <div class="container">
        <div class="background"></div>

        <div class="content">
            <h1 class="title">CRÉDITOS</h1>
            <p class="subtitle">> EQUIPE QUARTO 404</p>

            <div class="credits-viewport">
                <div class="credits-list">
                    <div v-for="(membro, index) in membros" :key="index" class="credit-item">
                        <h3 class="member-name">{{ membro.nome }}</h3>
                        <p class="member-role">{{ membro.funcao }}</p>
                    </div>
                </div>
            </div>

            <button @click="returnToMenu" class="return">RETORNAR</button>
        </div>
    </div>
</template>

<style scoped>
/* Importação das fontes (mantido do original) */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Press+Start+2P&display=swap');

/* --- ESTILOS GERAIS (maioria mantida do original) --- */
.container {
    width: 100vw;
    height: 100vh;
    background: #000;
    color: #00ff88;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    overflow: hidden;
    /* Garante que nada saia da tela */
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: matrix 20s linear infinite;
    z-index: -1;
}

.content {
    background: rgba(0, 20, 10, 0.9);
    border: 1px solid #00ff88;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    max-width: 800px;
    width: 90%;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.2), inset 0 0 15px rgba(0, 255, 136, 0.1);
    display: flex;
    flex-direction: column;
    height: 80vh;
    /* Altura do conteúdo principal */
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

/* --- NOVA SEÇÃO DE CRÉDITOS COM ROLAGEM --- */

/**
 * Viewport dos Créditos (A "Janela")
 * - flex-grow: 1 -> Faz este elemento ocupar todo o espaço vertical disponível no .content.
 * - overflow: hidden -> Essencial! Esconde qualquer parte da lista que saia dos limites deste contentor.
 */
.credits-viewport {
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(transparent, black 20%, black 80%, transparent);
    /* Efeito de fade nas bordas */
    -webkit-mask-image: linear-gradient(transparent, black 20%, black 80%, transparent);
}

/**
 * A Lista de Créditos que se move
 * - position: relative -> Permite o uso da animação 'transform'.
 * - animation -> Aplica a nossa animação de rolagem.
 */
.credits-list {
    position: relative;
    animation: scroll-credits 30s linear infinite;
    /* Duração da animação pode ser ajustada */
}

/**
 * Animação de Rolagem
 * - from -> Começa com a lista completamente abaixo da viewport.
 * - to -> Termina com a lista completamente acima da viewport.
 */
@keyframes scroll-credits {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(-100%);
    }
}

/**
 * Estilo para cada item na lista de créditos
 */
.credit-item {
    padding: 20px 0;
}

.member-name {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    color: #00ff88;
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
    text-transform: uppercase;
}

.member-role {
    margin: 0;
    font-size: 1rem;
    opacity: 0.7;
    text-transform: uppercase;
}


/* --- BOTÃO DE RETORNO (mantido do original) --- */
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
    margin-top: 30px;
    /* Adicionado para dar espaço */
    align-self: center;
    /* Centraliza o botão */
}

.return:hover {
    background: #00ff88;
    color: #000;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
}

@keyframes matrix {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(50px);
    }
}

/* --- AJUSTES PARA TELAS MENORES --- */
@media (max-width: 768px) {
    .title {
        font-size: 2rem;
    }

    .content {
        padding: 30px 20px;
        height: 85vh;
    }

    .member-name {
        font-size: 1.2rem;
    }

    .member-role {
        font-size: 0.9rem;
    }
}
</style>
