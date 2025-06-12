<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // 1. Importar o useRouter

// --- CONFIGURAÇÕES ---
const TYPING_SPEED_MS = 100;
const PAUSE_BETWEEN_PHRASES_MS = 20;

// --- FRASES A SEREM EXIBIDAS ---
const phrases = [
    "NÃO TEM ESCAPATÓRIA     ",
    "VOCÊ FEZ ISSO     ",
    "AGORA VOCE VAI REVIVER     ",
    "TODO DIA     ",
    "O MESMO PESADELO     ",
    "VERME ASSASSINO                 "
];

// --- LÓGICA DO COMPONENTE ---
const router = useRouter(); // 2. Obter a instância do router
const displayedText = ref('');
const currentPhraseIndex = ref(0);
let timeoutId = null;

const startTypingSequence = () => {
    // 3. Lógica modificada para o final da sequência
    if (currentPhraseIndex.value >= phrases.length) {
        // Chegou ao fim das frases, redirecionar para a SalaView
        router.push({
            name: 'Sala',
            params: { idQuarto: '404_2' }
        });
        return;
    }
    typePhrase(phrases[currentPhraseIndex.value]);
};

// Função que "digita" uma frase, letra por letra
const typePhrase = (phrase) => {
    let charIndex = 0;
    displayedText.value = '';

    const typeCharacter = () => {
        if (charIndex < phrase.length) {
            displayedText.value += phrase[charIndex];
            charIndex++;
            timeoutId = setTimeout(typeCharacter, TYPING_SPEED_MS);
        } else {
            timeoutId = setTimeout(() => {
                currentPhraseIndex.value++;
                startTypingSequence();
            }, PAUSE_BETWEEN_PHRASES_MS);
        }
    };

    typeCharacter();
};

onMounted(() => {
    startTypingSequence();
});

onUnmounted(() => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
});
</script>

<template>
    <div class="horror-container">
        <p class="dialogue-text">
            {{ displayedText }}
            <span class="cursor"></span>
        </p>
    </div>
</template>

<style scoped>
/* O CSS CONTINUA IGUAL */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.horror-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    padding: 20px;
    box-sizing: border-box;
}

.dialogue-text {
    font-family: 'Press Start 2P', cursive;
    color: #a11a1a;
    font-size: 2rem;
    text-align: center;
    text-shadow:
        0 0 5px #ff0000,
        0 0 10px #ff0000;
    line-height: 1.5;
    min-height: 3em;
}

.cursor {
    display: inline-block;
    width: 1.2rem;
    height: 2.2rem;
    background-color: #a11a1a;
    margin-left: 10px;
    vertical-align: bottom;
    animation: blink 0.7s step-end infinite;
}

@keyframes blink {

    from,
    to {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .dialogue-text {
        font-size: 1.2rem;
    }

    .cursor {
        width: 0.8rem;
        height: 1.4rem;
    }
}
</style>
