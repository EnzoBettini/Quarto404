<template>
  <div class="horror-container"><!--Painel-->
    <div class="tv-control-panel"><!--Onde ficam os potenciômetros -->
      <div class="panel-texture"></div>
      
      <!-- Botão de sair -->
      <button class="exit-button" @click="handleExit" title="Sair">
        Sair
      </button>

      <div class="control-section">
        <div class="potentiometer-group">
          <div class="pot-label">VOLUME</div>
          <div class="potentiometer-housing">
            <div class="housing-ring"></div>
            <div class="dial-markings">
              <!--Rotação do potenciometro-->
              <div 
                v-for="i in 11" 
                :key="i"
                class="dial-mark" 
                :style="{ transform: `rotate(${225 - (i-1) * 22.5}deg)` }"
              >
                <div class="mark-line"></div>
                <div 
                  class="mark-text" 
                  :style="{ transform: `rotate(${-(225 - (i-1) * 22.5)}deg)` }"
                >
                  {{ i-1 }}
                </div>
              </div>
            </div>
            <!--Os potenciometros irão travar após todos estarem corretamente posicionados-->
            <div
              ref="knob1Ref"
              :class="['potentiometer', definirVisualPorProximidade(value1, target1Min, target1Max)]"
              @mousedown="event => { if (!resolvido) handleMouseDown1(event) }"
              :style="{ cursor: input1 ? 'grabbing' : (resolvido ? 'not-allowed' : 'grab') }"
              >              
              <div 
                class="knob-face" 
                :style="{ transform: `rotate(${valueToRotation(value1)}deg)` }"
              >
                <div class="knob-grooves">
                  <div 
                    v-for="i in 12" 
                    :key="i"
                    class="groove" 
                    :style="{ transform: `rotate(${(i-1) * 30}deg)` }" 
                  />
                </div>
                <div class="knob-indicator"></div>
                <div class="knob-center"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="potentiometer-group">
          <div class="pot-label">BASS</div>
          <div class="potentiometer-housing">
            <div class="housing-ring"></div>
            <div class="dial-markings">
              <div 
                v-for="i in 11" 
                :key="i"
                class="dial-mark" 
                :style="{ transform: `rotate(${225 - (i-1) * 22.5}deg)` }"
              >
                <div class="mark-line"></div>
                <div 
                  class="mark-text" 
                  :style="{ transform: `rotate(${-(225 - (i-1) * 22.5)}deg)` }"
                >
                  {{ i-1 }}
                </div>
              </div>
            </div>
             <div
              ref="knob2Ref"
              :class="['potentiometer', definirVisualPorProximidade(value2, target2Min, target2Max)]"
              @mousedown="event => { if (!resolvido) handleMouseDown2(event) }"
              :style="{ cursor: input1 ? 'grabbing' : (resolvido ? 'not-allowed' : 'grab') }"
              >    
              <div 
                class="knob-face" 
                :style="{ transform: `rotate(${valueToRotation(value2)}deg)` }"
              >
                <div class="knob-grooves">
                  <div 
                    v-for="i in 12" 
                    :key="i"
                    class="groove" 
                    :style="{ transform: `rotate(${(i-1) * 30}deg)` }" 
                  />
                </div>
                <div class="knob-indicator"></div>
                <div class="knob-center"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="potentiometer-group">
          <div class="pot-label">TREBLE</div>
          <div class="potentiometer-housing">
            <div class="housing-ring"></div>
            <div class="dial-markings">
              <div 
                v-for="i in 11" 
                :key="i"
                class="dial-mark" 
                :style="{ transform: `rotate(${225 - (i-1) * 22.5}deg)` }"
              >
                <div class="mark-line"></div>
                <div 
                  class="mark-text" 
                  :style="{ transform: `rotate(${-(225 - (i-1) * 22.5)}deg)` }"
                >
                  {{ i-1 }}
                </div>
              </div>
            </div>
             <div
              ref="knob3Ref"
              :class="['potentiometer', definirVisualPorProximidade(value3, target3Min, target3Max)]"
              @mousedown="event => { if (!resolvido) handleMouseDown3(event) }"
              :style="{ cursor: input1 ? 'grabbing' : (resolvido ? 'not-allowed' : 'grab') }"
              >    
              <div 
                class="knob-face" 
                :style="{ transform: `rotate(${valueToRotation(value3)}deg)` }"
              >
                <div class="knob-grooves">
                  <div 
                    v-for="i in 12" 
                    :key="i"
                    class="groove" 
                    :style="{ transform: `rotate(${(i-1) * 30}deg)` }" 
                  />
                </div>
                <div class="knob-indicator"></div>
                <div class="knob-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="resolvido" class="success-indicator">LIBERADO</div>
      <div v-if="puzzleJaCompletado && !dialogoAtivo" class="puzzle-completed-indicator">
        PUZZLE JÁ COMPLETADO
      </div>
    </div>
    <!--Cria uma mensagem apos resolver o puzzle-->
  <div v-if="resolvido && dialogoAtivo" class="dialogo-final" @click="proximaMensagem">
  {{ textoAtual }}
</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import audioFile from '@/assets/audio/audiosamples/Samples/interferencia_01.wav';
import { salvarProgressoPuzzle, verificarProgressoPuzzle } from '@/assets/utils/puzzleProgress';

//Guarda o chiado
let audio = null;

// o valor de cada input
const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)

const mensagens = [
  "Interrompemos nossa programação para uma notícia urgente.",
  "O corpo de uma hóspede foi encontrado hoje no Hotel Aurora, centro da cidade.",
  "Autoridades confirmaram que este é o quarto caso em menos de duas semanas.",
  "A polícia acredita que o responsável pode estar se passando por um funcionário do hotel.",
  "Se você está hospedado na região, evite sair do quarto e tranque a porta."
]

//Indica se todos os potenciômetros estão na posição correta
const resolvido = ref(false)

// Add after other refs
const puzzleJaCompletado = ref(false)

//Controla o texto final
const dialogoAtivo = ref(false)
const indiceMensagem = ref(0)
const textoAtual = ref('')

let intervalId = null

// Valida qual input esta sendo usado
const input1 = ref(false)
const input2 = ref(false)
const input3 = ref(false)

// Referências os potenciometros para caso ocorra alteração
const knob1Ref = ref(null)
const knob2Ref = ref(null)
const knob3Ref = ref(null)

// Valores alvo no puzzle, sendo a faixa de valores em q o input tem q estar para ficar correto
const target1Min = 64
const target1Max = 65
const target2Min = 12
const target2Max = 13
const target3Min = 87
const target3Max = 88

// Emits para comunicação com componente pai
const emit = defineEmits(['exit'])

// Computed para verificar se o valor que esta nos inputs correspondem à margem de valor
const isCorrect = computed(() => {
  const isKnob1Correct = value1.value >= target1Min && value1.value <= target1Max
  const isKnob2Correct = value2.value >= target2Min && value2.value <= target2Max
  const isKnob3Correct = value3.value >= target3Min && value3.value <= target3Max
  
  return isKnob1Correct && isKnob2Correct && isKnob3Correct
})

// Watcher para verificar quando o puzzle é resolvido, fica verificando se ele achou o valor, ou n
watch(isCorrect, (newValue) => {
  if (newValue && !resolvido.value) {
    resolvido.value = true
    // Salvar progresso no localStorage
    salvarProgressoPuzzle('401')
    setTimeout(() => {
     
    }, 1000)
     console.log("Componente Sala402 desmontado: Parando áudio.");
    if (audio) {
        audio.pause();
        audio.src = '';
        audio = null;
    }
  } else if (!newValue && !puzzleJaCompletado.value) {
    resolvido.value = false
  }
})

// Função para sair
const handleExit = () => {
  emit('exit')
}

// funcao para fazer a mudanca de cor conforme chega proximo à opção buscada
const definirVisualPorProximidade = (value, minTarget, maxTarget) => {
  if (value >= minTarget && value <= maxTarget) return "correct"
  if (value >= minTarget - 5 && value <= maxTarget + 5) return "close"
  return "far"
}


//pega o local do mouse e calcula o angulo em relação ao ponto central do potenciometro, depois envia para o
//  conversorAnguloValor
const calcularAngulo = (event, element) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
  return (angle * 180) / Math.PI
}

//transforma o angulo conseguido na função calcularAngulo para um valor de 0 à 100
const conversorAnguloValor = (angle) => {
  let normalizedAngle = angle + 90
  if (normalizedAngle < 0) normalizedAngle += 360
  if (normalizedAngle > 360) normalizedAngle -= 360

  const value = Math.max(0, Math.min(100, (normalizedAngle / 270) * 100))
  return Math.round(value)
}

//caracteristica visual, ele é utilizado para fazer um mini tremor conforme meche o potenciometro
const adicionarTremor = () => {
  return Math.random() * 0.3 - 0.15
}

//faz o valor de 0 à 100 conforme a rotação do potenciometro
const valueToRotation = (value) => {
  const tremor = adicionarTremor()
  return (value / 100) * 270 - 135 + tremor
}

// Handlers de mouse
const handleMouseDown1 = (e) => {
  input1.value = true
  e.preventDefault()
}

const handleMouseDown2 = (e) => {
  input2.value = true
  e.preventDefault()
}

const handleMouseDown3 = (e) => {
  input3.value = true
  e.preventDefault()
}

//faz libera o calculo de angulo se o usuario clicar em um potenciometro, fazendo assim com q ao clicar seja
//possivel girar o potenciometro desejado
const handleMouseMove = (e) => {
  if (input1.value && knob1Ref.value) {
    const angle = calcularAngulo(e, knob1Ref.value)
    value1.value = conversorAnguloValor(angle)
  }
  if (input2.value && knob2Ref.value) {
    const angle = calcularAngulo(e, knob2Ref.value)
    value2.value = conversorAnguloValor(angle)
  }
  if (input3.value && knob3Ref.value) {
    const angle = calcularAngulo(e, knob3Ref.value)
    value3.value = conversorAnguloValor(angle)
  }
}

const handleMouseUp = () => {
  input1.value = false
  input2.value = false
  input3.value = false
}

// controla as interaçoes do usuário apenas quando ele está dentro do componente
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // Verificar se o puzzle já foi completado anteriormente
  puzzleJaCompletado.value = verificarProgressoPuzzle('401')
  if (puzzleJaCompletado.value) {
    resolvido.value = true
  }

  audio = new Audio(audioFile);
  audio.loop = true;
  audio.volume = 0.1;
  audio.play().catch(error => {
      console.warn("A reprodução automática do áudio foi bloqueada pelo navegador:", error);
  });
})
// desativa as interaçoes do usuário quando ele já está fora do componente
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
   console.log("Componente Sala402 desmontado: Parando áudio.");
    if (audio) {
        audio.pause();
        audio.src = '';
        audio = null;
    }
})


defineProps({
  mensagemFinal: {
    type: String,
    default: 'Você percebe que agora consegue entender o que está sendo dito na televisão'
  }
})

// Função que escreve letra por letra
const digitarMensagem = (mensagem) => {
  textoAtual.value = ''
  let i = 0
  clearInterval(intervalId)

  intervalId = setInterval(() => {
    if (i < mensagem.length) {
      textoAtual.value += mensagem[i]
      i++
    } else {
      clearInterval(intervalId)
    }
  }, 30) // velocidade da digitação
}

// Iniciar diálogo após resolver o puzzle
watch(resolvido, (novoValor) => {
  if (novoValor) {
    dialogoAtivo.value = true
    indiceMensagem.value = 0
    digitarMensagem(mensagens[0])
  }
})

// Precisa clicar uma vez pra skipar o texto e uma segunda vez para avançar
const proximaMensagem = () => {
  if (intervalId) {
    clearInterval(intervalId) // para a digitação se o jogador clicar no meio
    textoAtual.value = mensagens[indiceMensagem.value]
    intervalId = null
    return
  }

  if (indiceMensagem.value < mensagens.length - 1) {
    indiceMensagem.value++
    digitarMensagem(mensagens[indiceMensagem.value])
  } else {
    dialogoAtivo.value = false
  }
}

</script>

<style scoped>
.horror-container {

  position: absolute;
  /* Aqui podem mudar a vontade o @media já está puxando pro certo do pc da faculdade */
  top: -5%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  z-index: 10; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', monospace;
  user-select: none;
  pointer-events: auto;
}

@media screen and (width: 1366px) and (height: 768px) {
  .horror-container {
    top: -111% !important;
  }
}

.tv-control-panel {
  position: relative;
  width: 500px;
  height: 180px;
  background: linear-gradient(145deg, #1a2520, #0f1612);
  border: 3px solid #2a3530;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.exit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background: linear-gradient(145deg, #2a3530, #1a2520);
  border: 2px solid #3a4530;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5a4f;
  z-index: 10;
  font-size: 12px;
  box-shadow: 
    0 0 10px rgba(0, 0, 0, 0.5),
    inset 0 0 5px rgba(74, 90, 79, 0.1);
}

.exit-button:hover {
  background: linear-gradient(145deg, #3a4530, #2a3530);
  border-color: #4a5a4f;
  box-shadow: 
    0 0 15px rgba(0, 0, 0, 0.7),
    inset 0 0 8px rgba(74, 90, 79, 0.2);
  transform: scale(1.05);
}

.exit-button:active {
  transform: scale(0.95);
}

.exit-icon {
  width: 16px;
  height: 16px;
  color: #4a5a4f;
  transition: color 0.3s ease;
}

.exit-button:hover .exit-icon {
  color: #6a7a6f;
}

.panel-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(42, 53, 48, 0.03) 1px,
      rgba(42, 53, 48, 0.03) 2px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.05) 1px,
      rgba(0, 0, 0, 0.05) 2px
    );
  pointer-events: none;
  z-index: 1;
  animation: static-flicker 3s ease-in-out infinite;
}

.control-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.potentiometer-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.pot-label {
  color: #4a5a4f;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(74, 90, 79, 0.6);
  margin-bottom: 5px;
}

.potentiometer-housing {
  position: relative;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle at 30% 30%, #2a3530, #1a2520, #0f1612);
  border: 3px solid #2a3530;
  border-radius: 50%;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(42, 53, 48, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.housing-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid rgba(42, 53, 48, 0.2);
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(42, 53, 48, 0.1), transparent);
}

.dial-markings {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.dial-mark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mark-line {
  width: 1px;
  height: 5px;
  background-color: #4a5a4f;
  opacity: 0.5;
  margin-top: 5px;
}

.mark-text {
  color: #4a5a4f;
  font-size: 6px;
  margin-top: 2px;
  opacity: 0.5;
}

.potentiometer {
  width: 70px;
  height: 70px;
  position: relative;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: grab;
}

.potentiometer:active {
  cursor: grabbing;
}

.knob-face {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  transition: transform 0.1s ease;
  background: radial-gradient(circle at 30% 30%, #3a4a3f, #2a3530, #1a2520);
  border: 2px solid #2a3530;
  box-shadow: 
    0 0 10px rgba(0, 0, 0, 0.8),
    inset 0 0 15px rgba(0, 0, 0, 0.6),
    inset 0 0 5px rgba(74, 90, 79, 0.1);
}

.knob-grooves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.groove {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 1px;
  height: 8px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  transform-origin: 50% 27px;
  margin-left: -0.5px;
}

.knob-indicator {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #4a5a4f, #2a3530);
  border-radius: 2px;
  transform: translateX(-50%);
  box-shadow: 
    0 0 5px rgba(74, 90, 79, 0.5),
    inset 0 0 2px rgba(255, 255, 255, 0.1);
}

.knob-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #1a2520, #0f1612);
  border: 1px solid #2a3530;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    inset 0 0 8px rgba(0, 0, 0, 0.8),
    0 0 3px rgba(42, 53, 48, 0.3);
}

/* Efeito visual mais perceptível mas ainda sutil */
.potentiometer.close .knob-indicator {
  background: linear-gradient(to bottom, #5a6a5f, #3a4a3f);
  box-shadow: 
    0 0 7px rgba(90, 106, 95, 0.6),
    inset 0 0 2px rgba(255, 255, 255, 0.15);
}

.potentiometer.correct .knob-indicator {
  background: linear-gradient(to bottom, #6a7a6f, #4a5a4f);
  box-shadow: 
    0 0 10px rgba(106, 122, 111, 0.7),
    0 0 15px rgba(106, 122, 111, 0.4),
    inset 0 0 3px rgba(255, 255, 255, 0.2);
  animation: correct-pulse 2s ease-in-out infinite;
}

.potentiometer.correct .knob-face {
  box-shadow: 
    0 0 12px rgba(0, 0, 0, 0.8),
    inset 0 0 15px rgba(0, 0, 0, 0.6),
    inset 0 0 8px rgba(106, 122, 111, 0.2),
    0 0 20px rgba(106, 122, 111, 0.3);
}

.potentiometer.correct .housing-ring {
  border-color: rgba(106, 122, 111, 0.3);
  box-shadow: 0 0 10px rgba(106, 122, 111, 0.2);
}

.success-indicator {
  position: absolute;
  top: 15px;
  left: 20px;
  padding: 5px 10px;
  background: linear-gradient(145deg, #4a5a4f, #3a4a3f);
  border: 1px solid #6a7a6f;
  border-radius: 4px;
  color: #6a7a6f;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 
    0 0 15px rgba(106, 122, 111, 0.6),
    inset 0 0 5px rgba(255, 255, 255, 0.1);
  animation: success-glow 1s ease-in-out infinite alternate;
}

@keyframes static-flicker {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

@keyframes correct-pulse {
  0%, 100% {
    box-shadow: 
      0 0 10px rgba(106, 122, 111, 0.7),
      0 0 15px rgba(106, 122, 111, 0.4),
      inset 0 0 3px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 15px rgba(106, 122, 111, 0.8),
      0 0 25px rgba(106, 122, 111, 0.5),
      inset 0 0 4px rgba(255, 255, 255, 0.25);
  }
}

@keyframes success-glow {
  from {
    box-shadow: 
      0 0 15px rgba(106, 122, 111, 0.6),
      inset 0 0 5px rgba(255, 255, 255, 0.1);
  }
  to {
    box-shadow: 
      0 0 25px rgba(106, 122, 111, 0.8),
      inset 0 0 8px rgba(255, 255, 255, 0.2);
  }
}

@keyframes fadeInDialogo {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dialogo-final {
  position: fixed;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #a8ffb0;
  padding: 14px 22px;
  border-radius: 10px;
  font-size: 15px;
  font-family: 'Courier New', monospace;
  box-shadow: 0 0 10px rgba(168, 255, 176, 0.3);
  z-index: 999;
  max-width: 80vw;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s ease;
}

@media screen and (width: 1366px) and (height: 768px) {
  .dialogo-final {
    bottom: -80% !important;
  }
}

.dialogo-final:hover {
  background: rgba(0, 0, 0, 0.95);
}

.puzzle-completed-indicator {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  background: linear-gradient(145deg, #4a5a4f, #3a4a3f);
  border: 1px solid #6a7a6f;
  border-radius: 4px;
  color: #6a7a6f;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 
    0 0 15px rgba(106, 122, 111, 0.6),
    inset 0 0 5px rgba(255, 255, 255, 0.1);
  animation: success-glow 1s ease-in-out infinite alternate;
}
</style>
