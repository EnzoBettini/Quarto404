<template>

</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import audioFile from '@/assets/audio/audiosamples/Samples/Ambiente402.mp3';

let audio = null;

onMounted(() => {
    console.log("Componente Sala402 montado: Iniciando áudio.");
    audio = new Audio(audioFile);
    audio.loop = true;
    audio.play().catch(error => {
        console.warn("A reprodução automática do áudio foi bloqueada pelo navegador:", error);
    });
});

onUnmounted(() => {
    console.log("Componente Sala402 desmontado: Parando áudio.");
    if (audio) {
        audio.pause();
        audio.src = '';
        audio = null;
    }

});

</script>