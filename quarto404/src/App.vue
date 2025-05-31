<template>
  <div id="phaser-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, defineEmits } from 'vue'
import Phaser from 'phaser'

const emit = defineEmits(['door-clicked', 'elevator-clicked'])

class CorridorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CorridorScene' })
    this.vueEmit = null
  }

  init(data) {
    this.vueEmit = data.vueEmit
  }

  preload() {
    // Carregar mapa Tiled e tileset
    this.load.tilemapTiledJSON('mapa', '/src/assets/maps/corredor.json')
    this.load.image('tileset', '/src/assets/tiles/tileset.png')
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000')

    // Carregar o mapa
    const map = this.make.tilemap({ key: 'mapa' })
    const tileset = map.addTilesetImage('tileset', 'tileset')

    // Criar camadas
    const backgroundLayer = map.createLayer('Fundo', tileset, 0, 0)
    const collisionLayer = map.createLayer('Colisao', tileset, 0, 0)

    // Ativar colisão na camada marcada no Tiled
    if (collisionLayer) {
      collisionLayer.setCollisionByProperty({ colide: true })
    }

    // Exemplo: porta interativa baseada em coordenadas do mapa
    const porta401 = this.add.rectangle(100, 200, 70, 120, 0x5a3822).setStrokeStyle(2, 0x3e2718)
    this.add.text(100, 200, '401', { fontSize: '20px', fill: '#e0e0e0' }).setOrigin(0.5)

    porta401.setInteractive({ useHandCursor: true })
    porta401.on('pointerdown', () => {
      this.vueEmit('door-clicked', {
        doorId: '401',
        imageUrl: 'https://placehold.co/600x400/111111/FFFFFF/png?text=Interior+do+Quarto+401',
        description: 'Você entra no quarto 401. Uma TV está ligada...'
      })
    })
  }
}

onMounted(() => {
  const emitToVue = (event, payload) => emit(event, payload)

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [CorridorScene],
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    }
  })

  game.scene.getScene('CorridorScene').sys.settings.data = { vueEmit: emitToVue }
})

onBeforeUnmount(() => {
  const canvas = document.querySelector('#phaser-container canvas')
  if (canvas) canvas.remove()
})
</script>

<style scoped>
#phaser-container {
  width: 100%;
  height: 720px;
  max-width: 1280px;
  margin: 0 auto;
  border: 2px solid #444;
}
</style>
