<template>
  <div 
    ref="shake" 
    :class="{ 'shake-effect': shaking }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EfeitoShake',
  props: {
    intensidade: {
      type: Number,
      default: 5,
      validator: (value) => value >= 1 && value <= 10
    },
    duracao: {
      type: Number,
      default: 500
    },
    ativacao: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shaking: false
    }
  },
  watch: {
    ativacao(newValue) {
      if (newValue) {
        this.shake();
      }
    }
  },
  methods: {
    shake() {
      if (this.shaking) return;
      
      this.shaking = true;
      
      setTimeout(() => {
        this.shaking = false;
      }, this.duracao);
    }
  }
}
</script>

<style scoped>
.shake-effect {
  animation: shake-animation var(--shake-duration, 500ms) cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  perspective: 1000px;
}

@keyframes shake-animation {
  0%, 100% { 
    transform: translate3d(0, 0, 0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translate3d(calc(var(--shake-intensity, 5px) * -1), 0, 0);
  }
  20%, 40%, 60%, 80% {
    transform: translate3d(var(--shake-intensity, 5px), 0, 0);
  }
}

.shake-effect {
  --shake-intensity: v-bind('intensidade + "px"');
  --shake-duration: v-bind('duracao + "ms"');
}
</style>