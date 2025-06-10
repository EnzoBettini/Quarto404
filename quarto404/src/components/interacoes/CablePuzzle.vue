<template>
  <div class="puzzle-container">
    <div class="painel-principal">

      
      <div class="area-cabos">
        <!-- Terminais do lado esquerdo -->
        <div class="terminais-esquerda">
          <div 
            v-for="terminal in terminaisEsquerda" 
            :key="terminal.id"
            :class="['terminal', { 
              'terminal-selecionado': terminalSelecionado === terminal.id,
              'terminal-conectado': terminal.conectado 
            }]"
            @click="selecionarTerminal(terminal.id)"
          >
            <div class="terminal-interno"></div>
            <span class="terminal-label">{{ terminal.label }}</span>
          </div>
        </div>

        <!-- Área dos cabos no meio -->
        <div class="area-conexoes">
          <svg class="svg-cabos" width="300" height="400">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <line 
              v-for="cabo in cabosConectados" 
              :key="cabo.id"
              :x1="cabo.x1" 
              :y1="cabo.y1" 
              :x2="cabo.x2" 
              :y2="cabo.y2"
              :class="['cabo-linha', cabo.status]"
              :stroke="cabo.cor"
              stroke-width="4"
              filter="url(#glow)"
            />
          </svg>
        </div>

        <!-- Terminais do lado direito -->
        <div class="terminais-direita">
          <div 
            v-for="terminal in terminaisDireita" 
            :key="terminal.id"
            :class="['terminal', { 
              'terminal-selecionado': terminalSelecionado === terminal.id,
              'terminal-conectado': terminal.conectado 
            }]"
            @click="selecionarTerminal(terminal.id)"
          >
            <div class="terminal-interno"></div>
            <span class="terminal-label">{{ terminal.label }}</span>
          </div>
        </div>
      </div>

      <!-- Mensagem de sucesso -->
      <div v-if="puzzleCompleto" class="mensagem-sucesso">
        <div class="texto-sucesso">CABOS LIGADOS</div>
        <div class="sistema-online">QUARTO 404 ABERTO</div>
      </div>

      <!-- Botão voltar -->
      <button class="botao-voltar" @click="voltarSala">
        ← VOLTAR
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estados reativos
const terminalSelecionado = ref(null)
const cabosConectados = ref([])
const puzzleCompleto = ref(false)
const statusSistema = ref('SISTEMA OFFLINE - RECONECTE OS CABOS')

// Configuração dos terminais
const terminaisEsquerda = ref([
  { id: 'E1', label: 'PWR-A', conectado: false, pareamento: 'D2', posicao: { x: 0, y: 80 } },
  { id: 'E2', label: 'DATA', conectado: false, pareamento: 'D1', posicao: { x: 0, y: 160 } },
  { id: 'E3', label: 'GND', conectado: false, pareamento: 'D4', posicao: { x: 0, y: 240 } },
  { id: 'E4', label: 'PWR-B', conectado: false, pareamento: 'D3', posicao: { x: 0, y: 320 } }
])

const terminaisDireita = ref([
  { id: 'D1', label: 'IN-02', conectado: false, pareamento: 'E2', posicao: { x: 300, y: 80 } },
  { id: 'D2', label: 'IN-01', conectado: false, pareamento: 'E1', posicao: { x: 300, y: 160 } },
  { id: 'D3', label: 'IN-04', conectado: false, pareamento: 'E4', posicao: { x: 300, y: 240 } },
  { id: 'D4', label: 'IN-03', conectado: false, pareamento: 'E3', posicao: { x: 300, y: 320 } }
])

// Função para selecionar terminal
const selecionarTerminal = (terminalId) => {
  if (puzzleCompleto.value) return

  // Se nenhum terminal está selecionado, seleciona este
  if (!terminalSelecionado.value) {
    terminalSelecionado.value = terminalId
    return
  }

  // Se o mesmo terminal foi clicado, desseleciona
  if (terminalSelecionado.value === terminalId) {
    terminalSelecionado.value = null
    return
  }

  // Tenta fazer a conexão
  tentarConexao(terminalSelecionado.value, terminalId)
  terminalSelecionado.value = null
}

// Função para tentar conectar dois terminais
const tentarConexao = (terminal1Id, terminal2Id) => {
  const terminal1 = encontrarTerminal(terminal1Id)
  const terminal2 = encontrarTerminal(terminal2Id)

  if (!terminal1 || !terminal2) return

  // Verifica se já estão conectados
  if (terminal1.conectado || terminal2.conectado) return

  // Verifica se a conexão está correta
  const conexaoCorreta = terminal1.pareamento === terminal2Id

  // Cria o cabo visual
  const novoCabo = {
    id: `${terminal1Id}-${terminal2Id}`,
    x1: terminal1.posicao.x,
    y1: terminal1.posicao.y,
    x2: terminal2.posicao.x,
    y2: terminal2.posicao.y,
    status: conexaoCorreta ? 'correto' : 'incorreto',
    cor: conexaoCorreta ? '#00ff41' : '#ff4444',
    terminal1: terminal1Id,
    terminal2: terminal2Id
  }

  cabosConectados.value.push(novoCabo)

  if (conexaoCorreta) {
    // Marca terminais como conectados
    terminal1.conectado = true
    terminal2.conectado = true
    statusSistema.value = `CONEXÃO ESTABELECIDA - ${cabosConectados.value.filter(c => c.status === 'correto').length}/4`
    
    // Verifica se o puzzle foi completado
    verificarCompletude()
  } else {
    // Remove cabo incorreto após 1 segundo
    setTimeout(() => {
      cabosConectados.value = cabosConectados.value.filter(cabo => cabo.id !== novoCabo.id)
    }, 1000)
  }
}

// Função para encontrar terminal por ID
const encontrarTerminal = (terminalId) => {
  return [...terminaisEsquerda.value, ...terminaisDireita.value].find(t => t.id === terminalId)
}

// Função para verificar se o puzzle foi completado
const verificarCompletude = () => {
  const conexoesCorretas = cabosConectados.value.filter(cabo => cabo.status === 'correto').length
  
  if (conexoesCorretas === 4) {
    puzzleCompleto.value = true
    statusSistema.value = 'SISTEMA ONLINE - ENERGIA RESTAURADA'
    
    // Fecha automaticamente após 3 segundos
    setTimeout(() => {
      voltarSala()
    }, 3000)
  }
}

// Função para voltar à sala
const voltarSala = () => {
  router.push('/quarto/403')
 $emit('fechar-puzzle')
 
}

// Efeitos sonoros simulados no console (opcional)
const emitirSom = (tipo) => {
  console.log(`🔊 Som: ${tipo}`)
}

onMounted(() => {
  console.log('Puzzle de cabos carregado')
})
</script>

<style scoped>
.puzzle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  z-index: 1000;
}

.painel-principal {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 
    0 0 30px rgba(0, 255, 65, 0.1),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  min-width: 800px;
  min-height: 600px;
}

.titulo-puzzle {
  color: #00ff41;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  letter-spacing: 2px;
}

.status-display {
  color: #ffaa00;
  text-align: center;
  font-size: 12px;
  margin-bottom: 30px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid #333;
}

.area-cabos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 400px;
  position: relative;
}

.terminais-esquerda,
.terminais-direita {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.terminal {
  width: 80px;
  height: 60px;
  background: linear-gradient(145deg, #333, #222);
  border: 2px solid #555;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.terminal:hover {
  border-color: #777;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.terminal-selecionado {
  border-color: #ffaa00 !important;
  box-shadow: 0 0 20px rgba(255, 170, 0, 0.5) !important;
}

.terminal-conectado {
  border-color: #00ff41 !important;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3) !important;
}

.terminal-interno {
  width: 20px;
  height: 20px;
  background: #111;
  border-radius: 50%;
  border: 2px solid #666;
  margin-bottom: 4px;
}

.terminal-conectado .terminal-interno {
  background: #00ff41;
  border-color: #00ff41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

.terminal-label {
  color: #ccc;
  font-size: 10px;
  font-weight: bold;
}

.area-conexoes {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.svg-cabos {
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.cabo-linha {
  animation: cabo-pulse 2s infinite;
}

.cabo-linha.correto {
  stroke: #00ff41;
}

.cabo-linha.incorreto {
  stroke: #ff4444;
  animation: cabo-erro 1s ease-out;
}

@keyframes cabo-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes cabo-erro {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 0; }
}

.mensagem-sucesso {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 255, 65, 0.1);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  animation: sucesso-aparecer 0.5s ease-out;
}

.texto-sucesso {
  color: #00ff41;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
}

.sistema-online {
  color: #ffaa00;
  font-size: 14px;
  animation: piscar 1s infinite;
}

@keyframes sucesso-aparecer {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes piscar {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

.botao-voltar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: linear-gradient(145deg, #444, #333);
  border: 2px solid #666;
  border-radius: 6px;
  color: #ccc;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.botao-voltar:hover {
  background: linear-gradient(145deg, #555, #444);
  border-color: #777;
  color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.botao-voltar:active {
  transform: translateY(1px);
}
</style>