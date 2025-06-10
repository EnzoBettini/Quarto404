# Quarto 404

Um jogo de aventura/mistério baseado em navegação entre quartos, desenvolvido com Vue 3.

## Sobre o Projeto

Quarto 404 é uma experiência narrativa interativa onde o jogador navega entre quartos misteriosos, coletando chaves e desvendando segredos. A atmosfera é construída através de vídeos ambientais e efeitos sonoros.

## Tecnologias Utilizadas

- **Vue 3:** Framework JavaScript com Composition API
- **Vue Router:** Gerenciamento de navegação
- **Vite:** Build system e servidor de desenvolvimento

## Estrutura do Projeto

```
quarto404/
├── public/
│   ├── index.html         # Arquivo HTML principal
│   └── itens                # Para cada objeto interativo do jogo
├── src/
│   ├── assets/            # Arquivos estáticos processados pelo build
│   │   ├── videos/        # Vídeos do jogo
│   │   └── audio/         # Arquivos de áudio
│   ├── components/        # Componentes Vue
│   │   ├── MenuView.vue
│   │   ├── CorredorView.vue
│   │   ├── SalaView.vue
│   │   └── efeitos/       # Componentes de efeitos visuais
│   ├── router/
│   │   └── index.js       # Configuração de rotas
│   ├── App.vue            # Componente raiz
│   └── main.js            # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
└── README.md
```

## Principais Componentes

### MenuView
- Tela inicial com título "QUARTO 404"
- Vídeo de fundo ambiental (`elevator_edited.mp4`)
- Ao iniciar o jogo:
  - Reproduz efeito sonoro
  - Exibe vídeo introdutório
  - Navega para o Corredor

### CorredorView
- Corredor principal com vídeo em loop (`corridor_animated.mp4`)
- Título "Corredor Misterioso"
- Acesso aos quartos 401, 402, 403 e 404
- Opção para retornar ao menu principal

### SalaView
- Componente genérico para todos os quartos
- Identifica o quarto pelo parâmetro de rota (`idQuarto`)
- Exibe vídeo específico para cada quarto
- **Quartos 401, 402, 403:**
  - Botão "Voltar ao Corredor"
  - Botão "Pegar Chave" (mecânica de coleta)
- **Quarto 404:**
  - Botão "Voltar ao Menu Principal"

## Fluxo de Navegação

```
Menu Principal → Vídeo Introdutório → Corredor → Quarto X → Corredor/Menu
```

## Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão recomendada: 16+)

### Instalação

1. Clone o repositório:
   ```bash
   git clone [url-do-repositorio]
   ```

2. Navegue até a pasta do projeto:
   ```bash
   cd quarto404
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse o jogo no navegador:
   ```
   http://localhost:5173
   ```

### Build para Produção

```bash
npm run build
```

## Notas de Desenvolvimento

- O estado do jogo (chaves coletadas) não persiste entre recarregamentos da página
- Cada quarto possui seu próprio vídeo ambiental em loop
- Efeitos visuais como shake (tremilique) são implementados como componentes reutilizáveis
