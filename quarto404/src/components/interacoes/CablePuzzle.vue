<template>
  <div class="puzzle-container">
    <div class="painel-principal">
      <div class="puzzle-header">
        <div class="puzzle-title">SISTEMA DE RECONEXÃO</div>
        <div class="status-display" :class="{ 'status-online': puzzleCompleto }">
          {{ statusSistema }}
        </div>
      </div>
      
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
            <div class="terminal-conector">
              <div class="terminal-interno"></div>
              <div class="terminal-anel"></div>
            </div>
            <div class="terminal-label">{{ terminal.label }}</div>
          </div>
        </div>

        <!-- Área dos cabos no meio -->
        <div class="area-conexoes">
          <svg class="svg-cabos" width="300" height="400">
            <defs>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <linearGradient id="caboGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00ff41" stop-opacity="0.8"/>
                <stop offset="50%" stop-color="#00ff41" stop-opacity="1"/>
                <stop offset="100%" stop-color="#00ff41" stop-opacity="0.8"/>
              </linearGradient>
              
              <linearGradient id="caboErroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff4444" stop-opacity="0.8"/>
                <stop offset="50%" stop-color="#ff4444" stop-opacity="1"/>
                <stop offset="100%" stop-color="#ff4444" stop-opacity="0.8"/>
              </linearGradient>
            </defs>
            
            <line 
              v-for="cabo in cabosConectados" 
              :key="cabo.id"
              :x1="cabo.x1" 
              :y1="cabo.y1" 
              :x2="cabo.x2" 
              :y2="cabo.y2"
              :class="['cabo-linha', cabo.status]"
              :stroke="cabo.status === 'correto' ? 'url(#caboGradient)' : 'url(#caboErroGradient)'"
              stroke-width="6"
              stroke-linecap="round"
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
            <div class="terminal-conector">
              <div class="terminal-interno"></div>
              <div class="terminal-anel"></div>
            </div>
            <div class="terminal-label">{{ terminal.label }}</div>
          </div>
        </div>
      </div>

      <!-- Mensagem de sucesso -->
      <div v-if="puzzleCompleto" class="mensagem-sucesso">
        <div class="texto-sucesso">CABOS LIGADOS</div>
        <div class="sistema-online">QUARTO 404 ABERTO</div>
        <div class="success-icon">
          <div class="checkmark"></div>
        </div>
      </div>

      <!-- Botão voltar -->
      <button class="fechar-btn" @click="voltarParaQuarto">
        <span class="btn-icon">×</span>
        <span class="btn-text">Fechar</span>
      </button>
      
      <!-- Instruções -->
      <div class="instrucoes">
        Conecte os terminais corretamente para restaurar a energia
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const voltarParaQuarto = () => {
  router.push({ 
    name: 'Sala',
    params: { idQuarto: '403' }
  })
}

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
  { id: 'E4', label: 'PWR-B', conectado: false, pareamento: 'E4', posicao: { x: 0, y: 320 } }
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
    emitirSom('select')
    return
  }

  // Se o mesmo terminal foi clicado, desseleciona
  if (terminalSelecionado.value === terminalId) {
    terminalSelecionado.value = null
    emitirSom('deselect')
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
  if (terminal1.conectado || terminal2.conectado) {
    emitirSom('error')
    return
  }

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
    emitirSom('connect')
    statusSistema.value = `CONEXÃO ESTABELECIDA - ${cabosConectados.value.filter(c => c.status === 'correto').length}/4`
    
    // Verifica se o puzzle foi completado
    verificarCompletude()
  } else {
    emitirSom('error')
    // Remove cabo incorreto após 1 segundo
    setTimeout(() => {
      cabosConectados.value = cabosConectados.value.filter(cabo => cabo.id !== novoCabo.id)
    }, 3000)
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
    emitirSom('success')
    
    // Fecha automaticamente após 3 segundos
    setTimeout(() => {
      voltarParaQuarto()
    }, 3000)
  }
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
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.puzzle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #121212 0%, #050505 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  z-index: 1000;
  overflow: hidden;
}

.puzzle-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      rgba(0, 255, 65, 0.03) 0px,
      rgba(0, 255, 65, 0.03) 1px,
      transparent 1px,
      transparent 2px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 255, 65, 0.03) 0px,
      rgba(0, 255, 65, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
  pointer-events: none;
}

.painel-principal {
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  border: 2px solid #333;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 
    0 0 40px rgba(0, 255, 65, 0.15),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
  position: relative;
  width: 800px;
  min-height: 600px;
  overflow: hidden;
}

.painel-principal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.5), transparent);
}

.puzzle-header {
  margin-bottom: 30px;
  text-align: center;
}

.puzzle-title {
  color: #00ff41;
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.status-display {
  color: #ff9900;
  font-size: 14px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  border: 1px solid #333;
  display: inline-block;
  transition: all 0.3s ease;
}

.status-online {
  color: #00ff41;
  border-color: #00ff41;
  background: rgba(0, 255, 65, 0.1);
  animation: pulse 2s infinite;
}

.area-cabos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 400px;
  position: relative;
  margin: 0 auto;
  max-width: 700px;
}

.terminais-esquerda,
.terminais-direita {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px 0;
}

.terminal {
  width: 100px;
  height: 70px;
  background: linear-gradient(145deg, #222, #111);
  border: 2px solid #444;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.terminal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.terminal:hover {
  border-color: #666;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
  transform: translateY(-2px);
}

.terminal-selecionado {
  border-color: #ff9900 !important;
  box-shadow: 0 0 25px rgba(255, 153, 0, 0.5) !important;
  transform: translateY(-3px);
}

.terminal-conectado {
  border-color: #00ff41 !important;
  box-shadow: 0 0 25px rgba(0, 255, 65, 0.4) !important;
}

.terminal-conector {
  position: relative;
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
}

.terminal-interno {
  width: 16px;
  height: 16px;
  background: #222;
  border-radius: 50%;
  border: 2px solid #555;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.terminal-anel {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #444;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.terminal-selecionado .terminal-interno {
  background: #ff9900;
  border-color: #ff9900;
  box-shadow: 0 0 10px rgba(255, 153, 0, 0.7);
}

.terminal-selecionado .terminal-anel {
  border-color: #ff9900;
  box-shadow: 0 0 10px rgba(255, 153, 0, 0.3);
}

.terminal-conectado .terminal-interno {
  background: #00ff41;
  border-color: #00ff41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
}

.terminal-conectado .terminal-anel {
  border-color: #00ff41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

.terminal-label {
  color: #ccc;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.area-conexoes {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: -1;
}

.svg-cabos {
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.7));
}

.cabo-linha {
  animation: cabo-pulse 2s infinite;
}

.cabo-linha.correto {
  stroke-dasharray: 5, 3;
  animation: cabo-pulse 2s infinite, cabo-dash 30s linear infinite;
}

.cabo-linha.incorreto {
  stroke-dasharray: 5, 3;
  animation: cabo-erro 1s ease-out;
}

@keyframes cabo-pulse {
  0%, 100% { opacity: 0.8; stroke-width: 5px; }
  50% { opacity: 1; stroke-width: 6px; }
}

@keyframes cabo-dash {
  to { stroke-dashoffset: -1000; }
}

@keyframes cabo-erro {
  0% { opacity: 1; stroke-width: 6px; }
  50% { opacity: 0.5; stroke-width: 4px; }
  100% { opacity: 0; stroke-width: 2px; }
}

.mensagem-sucesso {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  animation: sucesso-aparecer 0.5s ease-out;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
  min-width: 300px;
}

.texto-sucesso {
  color: #00ff41;
  font-size: 28px;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
  letter-spacing: 2px;
}

.sistema-online {
  color: #ff9900;
  font-size: 16px;
  animation: piscar 1s infinite;
  margin-bottom: 20px;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 65, 0.1);
  border: 2px solid #00ff41;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  animation: pulse 2s infinite;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 15px;
  border-bottom: 3px solid #00ff41;
  border-left: 3px solid #00ff41;
  transform: translate(-50%, -60%) rotate(-45deg);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
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
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.6; }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 65, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.8); }
}

.fechar-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(20, 20, 20, 0.8);
  color: #ccc;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fechar-btn:hover {
  background: rgba(40, 40, 40, 0.9);
  color: #fff;
  border-color: #666;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.fechar-btn:active {
  transform: translateY(1px);
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

.instrucoes {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #888;
  font-size: 12px;
  max-width: 300px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
