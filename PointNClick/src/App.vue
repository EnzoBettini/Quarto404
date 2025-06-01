<template>
  <div class="game-wrapper">
    <div class="game-container">
      <!-- Game Scene -->
      <div :class="['scene', currentRoom]">
        <!-- Hospital Room Objects -->
        <div
          v-if="currentRoom === 'hospitalRoom'"
          class="clickable bed"
          @click="interact('cama')"
          @mouseenter="showTooltip('Examinar cama')"
          @mouseleave="hideTooltip"
        ></div>

        <!-- Hospital Corridor Objects -->
        <div
          v-if="currentRoom === 'hospitalCorridor'"
          class="clickable stretcher"
          @click="interact('maca')"
          @mouseenter="showTooltip('Examinar maca')"
          @mouseleave="hideTooltip"
        ></div>

        <!-- Room Transition Overlay -->
        <div v-if="isTransitioning" class="transition-overlay"></div>
      </div>

      <!-- Tooltip -->
      <div v-if="tooltip.show" class="tooltip" :style="tooltipStyle">
        {{ tooltip.text }}
      </div>

      <!-- UI Panel -->
      <div class="ui-panel">
        <!-- Navigation Buttons -->
        <div class="navigation">
          <button 
            @click="switchRoom('hospitalRoom')" 
            :class="{ active: currentRoom === 'hospitalRoom' }"
            class="nav-button"
          >
            <span class="icon">🏥</span>
            Sala de Hospital
          </button>
          <button 
            @click="switchRoom('hospitalCorridor')" 
            :class="{ active: currentRoom === 'hospitalCorridor' }"
            class="nav-button"
          >
            <span class="icon">🚪</span>
            Corredor
          </button>
        </div>

        <!-- Message Display -->
        <div class="message-container">
          <div v-if="message" class="message">
            <div class="message-icon">💭</div>
            <div class="message-text">{{ message }}</div>
          </div>
        </div>
      </div>

      <!-- Room Title -->
      <div class="room-title">
        {{ getRoomTitle() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const currentRoom = ref('hospitalRoom')
const message = ref('')
const isTransitioning = ref(false)

const tooltip = reactive({
  show: false,
  text: '',
  x: 0,
  y: 0
})

const tooltipStyle = computed(() => ({
  left: `${tooltip.x}px`,
  top: `${tooltip.y}px`
}))

function switchRoom(room) {
  if (room === currentRoom.value) return
  
  isTransitioning.value = true
  message.value = ''
  
  setTimeout(() => {
    currentRoom.value = room
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }, 300)
}

function interact(object) {
  const interactions = {
    'cama': 'Você examina a cama: há marcas de uso recente. As cobertas estão desarrumadas e há um cheiro estranho no ar.',
    'maca': 'Você observa a maca: ela está suja de sangue seco. Parece ter sido usada recentemente para transportar alguém ferido.'
  }
  
  message.value = interactions[object] || 'Você não encontra nada interessante aqui.'
  
  // Clear message after 8 seconds
  setTimeout(() => {
    message.value = ''
  }, 8000)
}

function showTooltip(text) {
  tooltip.text = text
  tooltip.show = true
}

function hideTooltip() {
  tooltip.show = false
}

function getRoomTitle() {
  const titles = {
    'hospitalRoom': 'Sala de Hospital',
    'hospitalCorridor': 'Corredor do Hospital'
  }
  return titles[currentRoom.value] || ''
}

// Handle mouse movement for tooltip positioning
function handleMouseMove(event) {
  tooltip.x = event.clientX + 10
  tooltip.y = event.clientY - 30
}

// Add event listener for mouse movement
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handleMouseMove)
}
</script>

<style scoped>
.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #2a2a2a;
  padding: 20px;
  font-family: 'Courier New', monospace;
}

.game-container {
  position: relative;
  width: 900px;
  height: 600px;
  border: 3px solid #444;
  overflow: hidden;
  background: #000;
}

.scene {
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  transition: opacity 0.5s ease;
  filter: brightness(0.7) contrast(1.2) sepia(0.2);
}

.scene.hospitalRoom {
  background-image: url('https://m.media-amazon.com/images/I/71HWxeJ6zRL._AC_UF894,1000_QL80_.jpg');
}

.scene.hospitalCorridor {
  background-image: url('https://media.istockphoto.com/id/627892060/pt/foto/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=SjVnmiwz6JsUYfqawD9XDE1qXYECDCZmTQp2U9Bn9Yg=');
}

.transition-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 10;
  animation: fadeInOut 0.5s ease;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.clickable {
  position: absolute;
  cursor: pointer;
  border: 2px dashed #666;
  transition: border-color 0.2s ease;
}

.clickable:hover {
  border-color: #999;
}

.interaction-hint {
  display: none;
}

.pulse-dot {
  display: none;
}

/* Object Positions */
.bed {
  top: 52%;
  left: 58%;
  width: 20%;
  height: 15%;
}

.stretcher {
  top: 58%;
  left: 28%;
  width: 22%;
  height: 14%;
}

.tooltip {
  position: fixed;
  background: #1a1a1a;
  color: #ccc;
  padding: 6px 10px;
  border: 1px solid #555;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  font-family: 'Courier New', monospace;
}

.ui-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-top: 2px solid #444;
  padding: 15px;
}

.navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #333;
  color: #ccc;
  border: 2px solid #555;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #444;
  border-color: #666;
  color: #ddd;
}

.nav-button.active {
  background: #4a4a4a;
  border-color: #777;
  color: #fff;
}

.icon {
  font-size: 14px;
  filter: grayscale(1);
}

.message-container {
  min-height: 50px;
  display: flex;
  align-items: center;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #222;
  border: 1px solid #444;
  padding: 12px;
  color: #bbb;
  font-size: 13px;
  line-height: 1.4;
  font-family: 'Courier New', monospace;
  animation: fadeIn 0.3s ease;
}

.message-icon {
  font-size: 16px;
  margin-top: 1px;
  flex-shrink: 0;
  filter: grayscale(1);
}

.message-text {
  flex: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.room-title {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #1a1a1a;
  color: #aaa;
  padding: 8px 15px;
  border: 1px solid #444;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .game-container {
    width: 100%;
    max-width: 500px;
    height: 400px;
  }
  
  .navigation {
    flex-direction: column;
    gap: 6px;
  }
  
  .nav-button {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .message {
    font-size: 12px;
    padding: 10px;
  }
  
  .room-title {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>