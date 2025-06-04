// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Vamos renomear HomeView para MenuView e criar GameView
import MenuView from '../components/MenuView.vue'; // Antiga HomeView, vamos renomear/modificar
import GameView from '../components/CorredorView.vue';   // Uma nova view para simular o início do jogo

const routes = [
    {
        path: '/', // A raiz do site será o menu do jogo
        name: 'Menu',
        component: MenuView
    },
    {
        path: '/jogo', // Rota para quando o jogo "começar"
        name: 'Game',
        component: GameView
    }
    // A rota '/intro-video' não será mais uma view separada,
    // o vídeo tocará na própria tela de menu.
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || process.env.BASE_URL || '/'),
    routes
});

export default router;
