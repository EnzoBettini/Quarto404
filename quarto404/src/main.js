// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importa nossa configuração do router (de src/router/index.js)
// Se você tem um arquivo CSS principal, pode importá-lo aqui também:
// import './assets/main.css' // Descomente se você tiver este arquivo

const app = createApp(App)

app.use(router) // Diz ao Vue para usar o router

app.mount('#app') // Monta a aplicação na <div id="app"> do seu index.html
