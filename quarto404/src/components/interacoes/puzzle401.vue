<template>
  <div class="horror-container">
    <div class="tv-control-panel">
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
              ref="knob1Ref"
              :class="['potentiometer', getProximityClass(value1, target1Min, target1Max)]"
              @mousedown="handleMouseDown1"
              :style="{ cursor: isDragging1 ? 'grabbing' : 'grab' }"
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
              :class="['potentiometer', getProximityClass(value2, target2Min, target2Max)]"
              @mousedown="handleMouseDown2"
              :style="{ cursor: isDragging2 ? 'grabbing' : 'grab' }"
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
              :class="['potentiometer', getProximityClass(value3, target3Min, target3Max)]"
              @mousedown="handleMouseDown3"
              :style="{ cursor: isDragging3 ? 'grabbing' : 'grab' }"
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

      <div v-if="solved" class="success-indicator">UNLOCKED</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'


// Estados reativos
const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
const solved = ref(false)
const isDragging1 = ref(false)
const isDragging2 = ref(false)
const isDragging3 = ref(false)

// Referências dos elementos
const knob1Ref = ref(null)
const knob2Ref = ref(null)
const knob3Ref = ref(null)

// Valores alvo
const target1Min = 63
const target1Max = 65
const target2Min = 12
const target2Max = 15
const target3Min = 87
const target3Max = 88

// Emits para comunicação com componente pai
const emit = defineEmits(['exit'])

// Computed para verificar se está resolvido
const isCorrect = computed(() => {
  const isKnob1Correct = value1.value >= target1Min && value1.value <= target1Max
  const isKnob2Correct = value2.value >= target2Min && value2.value <= target2Max
  const isKnob3Correct = value3.value >= target3Min && value3.value <= target3Max
  
  return isKnob1Correct && isKnob2Correct && isKnob3Correct
})

// Watcher para verificar quando o puzzle é resolvido
watch(isCorrect, (newValue) => {
  if (newValue && !solved.value) {
    solved.value = true
    setTimeout(() => {
      alert("Você encontrou a frequência correta! O mecanismo foi desbloqueado...")
    }, 1000)
  } else if (!newValue) {
    solved.value = false
  }
})

// Função para sair
const handleExit = () => {
  emit('exit')
}

// Funções utilitárias
const getProximityClass = (value, minTarget, maxTarget) => {
  if (value >= minTarget && value <= maxTarget) return "correct"
  if (value >= minTarget - 5 && value <= maxTarget + 5) return "close"
  return "far"
}

const calculateAngle = (event, element) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
  return (angle * 180) / Math.PI
}

const angleToValue = (angle) => {
  let normalizedAngle = angle + 90
  if (normalizedAngle < 0) normalizedAngle += 360
  if (normalizedAngle > 360) normalizedAngle -= 360

  const value = Math.max(0, Math.min(100, (normalizedAngle / 270) * 100))
  return Math.round(value)
}

const applyTremor = () => {
  return Math.random() * 0.3 - 0.15
}

const valueToRotation = (value) => {
  const tremor = applyTremor()
  return (value / 100) * 270 - 135 + tremor
}

// Handlers de mouse
const handleMouseDown1 = (e) => {
  isDragging1.value = true
  e.preventDefault()
}

const handleMouseDown2 = (e) => {
  isDragging2.value = true
  e.preventDefault()
}

const handleMouseDown3 = (e) => {
  isDragging3.value = true
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (isDragging1.value && knob1Ref.value) {
    const angle = calculateAngle(e, knob1Ref.value)
    value1.value = angleToValue(angle)
  }
  if (isDragging2.value && knob2Ref.value) {
    const angle = calculateAngle(e, knob2Ref.value)
    value2.value = angleToValue(angle)
  }
  if (isDragging3.value && knob3Ref.value) {
    const angle = calculateAngle(e, knob3Ref.value)
    value3.value = angleToValue(angle)
  }
}

const handleMouseUp = () => {
  isDragging1.value = false
  isDragging2.value = false
  isDragging3.value = false
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.horror-container {
  /* --- ADICIONE ESTAS PROPRIEDADES --- */
  position: absolute;
  top: -850%; /* Por padrão, 50% para alinhar ao centro vertical */
  left: 50%; /* 50% para alinhar ao centro horizontal */
  transform: translate(-50%, -50%); /* Truque para centralizar o painel perfeitamente */
  z-index: 10; /* Um z-index alto para garantir que ele fique na frente de tudo */
  /* ------------------------------------ */


  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', monospace;
  user-select: none;
  /* Fundo transparente removido */
  pointer-events: auto;
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
  width: 32px;
  height: 32px;
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
</style>