<template>
  <div class="puzzle-wrapper">
    <h2>Conecte os cabos na ordem correta</h2>
    <div class="cable-grid">
      <button
        v-for="(cable, index) in cables"
        :key="index"
        :class="{ selected: userSequence.includes(index), correct: isSolved }"
        @click="selectCable(index)"
        :disabled="isSolved"
      >
        {{ cable.label }}
      </button>
    </div>
    <div v-if="isSolved" class="solved-message">
      ✅ Puzzle resolvido! Você pode assistir ao vídeo na TV.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const emit = defineEmits(['puzzle-solved'])

const cables = [
  { label: '🔴' },
  { label: '🟢' },
  { label: '🔵' },
  { label: '🟡' }
]

// Defina a sequência correta (por índice)
const correctSequence = [2, 0, 1, 3]

const userSequence = ref([])

const isSolved = computed(() => {
  return (
    userSequence.value.length === correctSequence.length &&
    userSequence.value.every((val, idx) => val === correctSequence[idx])
  )
})

function selectCable(index) {
  if (userSequence.value.includes(index) || isSolved.value) return

  userSequence.value.push(index)

  if (isSolved.value) {
    emit('puzzle-solved')
  }

  // Reset automático se errar a sequência antes de terminar
  const currentIndex = userSequence.value.length - 1
  if (userSequence.value[currentIndex] !== correctSequence[currentIndex]) {
    setTimeout(() => {
      userSequence.value = []
    }, 500)
  }
}
</script>

<style scoped>
.puzzle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.cable-grid {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  gap: 10px;
  margin-top: 20px;
}

button {
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
}

button.selected {
  background-color: #ddd;
}

button.correct {
  background-color: lightgreen;
}

.solved-message {
  margin-top: 20px;
  font-weight: bold;
  color: green;
}
</style>
