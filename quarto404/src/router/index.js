// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import MenuView from '../components/MenuView.vue';
import CorredorView from '../components/CorredorView.vue'; // Este é o seu GameView.vue
import SalaView from '../components/SalaView.vue';     // Componente para os quartos
import CreditosView from '@/components/CreditosView.vue'; // Componente creditos
import CablePuzzle from '@/components/interacoes/CablePuzzle.vue'; // Componente do puzzle de cabos
import GeladeiraView from '@/components/interacoes/geladeira402.vue'; // Componente da geladeira
import Pinpad402 from '@/components/interacoes/puzzle402.vue';
import Final402 from '@/components/interacoes/puzzle402a.vue';

const routes = [
    {
        path: '/',
        name: 'Menu',
        component: MenuView
    },
    {
        path: '/creditos',
        name: 'Creditos',
        component: CreditosView
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
    },
   {
        path: '/quarto/402/geladeira',
        name: 'Geladeira402',
        component: GeladeiraView,
    },
    {
        path: '/quarto/402/pinpad',
        name: 'Pinpad402',
        component: Pinpad402,
    },
    {
        path: '/quarto/402/final',
        name: 'Final402',
        component: Final402,
    },
    {
        path: '/quarto/403/puzzle',
        name: 'CablePuzzle',
        component: () => import('@/components/interacoes/CablePuzzle.vue')
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || process.env.BASE_URL || '/'),
    routes
});

export default router;
