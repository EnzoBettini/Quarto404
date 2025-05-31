<template>
    <div id="phaser-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, defineEmits } from 'vue'
import Phaser from 'phaser'

const emit = defineEmits(['door-clicked', 'elevator-clicked'])

class CorridorScene extends Phaser.Scene {
    constructor() {
        super('CorridorScene')
        this.vueEmit = null
    }

    init(data) {
        this.vueEmit = data.vueEmit
    }

    preload() {
        this.load.on('filecomplete', (key) => {
            console.log(`✅ Carregado: ${key}`)
        })
        this.load.on('loaderror', (file) => {
            console.error(`❌ Erro ao carregar:`, file)
        })

        this.load.tilemapTiledJSON('mapa', 'tilemap.json')
        this.load.image('tileset', 'tileset.png')
    }

    create() {
        this.cameras.main.setBackgroundColor('#000')

        const map = this.make.tilemap({ key: 'mapa' })
        const tileset = map.addTilesetImage('tileset', 'tileset')

        if (!tileset) {
            console.error('Tileset não foi carregado corretamente.')
            return
        }

        const camada = map.createLayer('Fundo', tileset, 0, 0)
        if (!camada) {
            console.warn('Camada "Fundo" não foi encontrada no mapa.')
        }

        // Interação teste
        const porta = this.add.rectangle(100, 300, 80, 120, 0x5a3822).setStrokeStyle(2, 0x3e2718)
        this.add.text(100, 300, '401', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5)
        porta.setInteractive({ useHandCursor: true })
        porta.on('pointerdown', () => {
            this.vueEmit('door-clicked', {
                doorId: '401',
                imageUrl: 'https://placehold.co/600x400/111111/FFFFFF/png?text=Quarto+401',
                description: 'Você entra no quarto 401. Há algo estranho no ar.'
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
                debug: true
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
