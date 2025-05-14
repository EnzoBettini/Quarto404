<template>
  <div class="game-container">
    <div :class="['scene', currentRoom]">
      <div
        v-if="currentRoom === 'hospitalRoom'"
        class="clickable bed"
        @click="interact('cama')"
      ></div>

      <div
        v-if="currentRoom === 'hospitalCorridor'"
        class="clickable stretcher"
        @click="interact('maca')"
      ></div>
    </div>

    <div class="ui">
      <div class="buttons">
        <button @click="switchRoom('hospitalRoom')">Ir para Sala de Hospital</button>
        <button @click="switchRoom('hospitalCorridor')">Ir para Corredor</button>
      </div>
      <p class="message" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentRoom = ref('hospitalRoom')
const message = ref('')

function switchRoom(room) {
  currentRoom.value = room
  message.value = ''
}

function interact(object) {
  if (object === 'cama') {
    message.value = 'Você examina a cama: há marcas de uso recente.'
  } else if (object === 'maca') {
    message.value = 'Você observa a maca: ela está suja de sangue seco.'
  }
}
</script>

<style scoped>
.game-container {
  position: relative;
  width: 800px;
  height: 500px;
  border: 2px solid #444;
  margin: auto;
  font-family: Arial, sans-serif;
}

.scene {
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
}

.scene.hospitalRoom {
  background-image: url('https://m.media-amazon.com/images/I/71HWxeJ6zRL._AC_UF894,1000_QL80_.jpg');
}

.scene.hospitalCorridor {
  background-image: url('https://cdna.artstation.com/p/assets/images/images/009/668/872/large/andrew-vasilkovskiy-pz-2v-hospital-corridor-raw.jpg?1520257794'); /* Corredor de hospital */
}

.clickable {
  position: absolute;
  cursor: pointer;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  transition: border 0.2s ease;
}
.clickable:hover {
  border: 2px solid #fff;
}

/* Cama na sala de hospital */
.bed {
  top: 52%;
  left: 58%;
  width: 20%;
  height: 15%;
}

/* Maca no corredor */
.stretcher {
  top: 58%;
  left: 28%;
  width: 22%;
  height: 14%;
}


.ui {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  text-shadow: 1px 1px 3px black;
}

.buttons button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #222;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}
.message {
  margin-top: 10px;
  font-size: 16px;
}
</style>
