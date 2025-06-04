## Tecnologias Utilizadas

- **Vue 3:** Framework JavaScript progressivo para construir interfaces de usuário. Estamos usando a Composition API com a sintaxe `<script setup>`.
- **Vue Router:** Para gerenciar a navegação entre as diferentes "telas" ou "views" do jogo (Menu, Corredor, Salas).
- **Vite:** Como ferramenta de build e servidor de desenvolvimento (suposição comum para projetos Vue 3 modernos. Se estiver usando Vue CLI, ajuste esta parte).

## Estrutura do Projeto (Principais Pastas e Arquivos)

quarto404/
├── public/
│ └── index.html # Arquivo HTML principal
│ └── (outros assets públicos como favicons, imagens de poster)
├── src/
│ ├── assets/ # Para arquivos estáticos processados pelo build (vídeos, áudios, imagens)
│ │ ├── videos/ # Onde os vídeos do jogo (menu, corredor, salas) devem estar
│ │ └── audio/ # Onde os arquivos de áudio devem estar
│ ├── components/ # Onde os nossos componentes de "tela" (Views) estão atualmente
│ │ ├── MenuView.vue
│ │ ├── CorredorView.vue
│ │ └── SalaView.vue
│ ├── router/
│ │ └── index.js # Configuração das rotas da aplicação
│ ├── App.vue # Componente raiz da aplicação (com &lt;router-view />)
│ └── main.js # Ponto de entrada da aplicação (inicializa Vue e Router)
├── package.json # Dependências e scripts do projeto
└── README.md # Este arquivo :)
└── (outras configurações como vite.config.js, etc.

1.  **`src/components/MenuView.vue`**:

    - É a tela inicial do jogo.
    - Mostra o título "QUARTO 404".
    - Tem um vídeo de fundo (`elevator_edited.mp4`) que serve de ambiente.
    - Ao clicar em "Começar Jogo":
      - Toca um som de início (`simpleboom.wav`).
      - O vídeo de fundo é reproduzido como uma introdução (com som, sem loop).
      - Após o término do vídeo (ou se houver erro), navega para a tela do Corredor.

2.  **`src/components/CorredorView.vue`**:

    - Representa o corredor principal do jogo, acessado após o menu.
    - Mostra um vídeo de fundo em loop (`corridor_animated.mp4`) com efeito de fade-in.
    - Exibe o título "Corredor Misterioso" e botões para acessar os diferentes quartos (401, 402, 403, 404).
    - Possui um botão para "Voltar ao Menu Principal".

3.  **`src/components/SalaView.vue`**:
    - Um componente genérico usado para todos os quartos (401, 402, 403, 404).
    - Recebe um `idQuarto` via parâmetro da rota (ex: `/quarto/401`).
    - Carrega e exibe um vídeo de fundo específico para o quarto correspondente (ex: `401_animated.mp4`), em loop e com fade-in.
    - **Para os quartos 401, 402, 403:**
      - Mostra um botão "Voltar ao Corredor".
      - Mostra um botão "Pegar Chave" (a lógica de coleta de chave é simulada e o estado não persiste entre recarregamentos da página por enquanto).
    - **Para o quarto 404 (ID '404_2'):**
      - Mostra apenas um botão "Voltar ao Menu Principal".

**Fluxo de Navegação Atual:**
`Menu` -> (clica em Começar Jogo, vídeo de intro toca) -> `Corredor` -> (clica em um Quarto X) -> `Sala X` -> (clica em Voltar) -> `Corredor` (ou `Menu` se estiver no Quarto 404).

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (que inclui o npm) instalado.

### Instalação

1.  Clone este repositório (se estiver no Git) ou descompacte os arquivos do projeto.
2.  Abra um terminal na pasta raiz do projeto.
3.  Instale as dependências:
    ```bash
    npm install
    ```

### Observação sobre o Vue Router

O Vue Router é essencial para a navegação. Ele deve ser instalado automaticamente com `npm install`. Caso precise ser instalado ou reinstalado manualmente, o comando é:
`npm install vue-router@4`
