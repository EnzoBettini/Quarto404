// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import MenuView from '../components/MenuView.vue';
import CorredorView from '../components/CorredorView.vue'; // Este é o seu GameView.vue
import SalaView from '../components/SalaView.vue';     // Componente para os quartos

const routes = [
    {
        path: '/',
        name: 'Menu',
        component: MenuView
    },
    {
        path: '/corredor', // Rota para o corredor
        name: 'Corredor',
        component: CorredorView
    },
    {
        path: '/quarto/:idQuarto', // Rota parametrizada para os quartos. Ex: /quarto/401
        name: 'Sala',             // Nome da rota que usaremos para navegar
        component: SalaView,
        props: true // Permite que o :idQuarto seja passado como uma "prop" para o SalaView
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || process.env.BASE_URL || '/'),
    routes
});

export default router;
