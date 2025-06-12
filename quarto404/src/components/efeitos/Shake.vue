<template>
  <div  
    ref="shake" 
    :class="{ 'shake-effect': shaking }"
    :style="cssVars"
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
      validator: (value) => value >= 1 && value <= 20
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
  computed: {
    cssVars() {
      return {
        '--shake-intensity': `${this.intensidade}px`,
        '--shake-duration': `${this.duracao}ms`
      }
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
        this.$emit('shake-complete');
      }, this.duracao);
    }
  }
}
</script>

<style scoped>
.shake-effect {
  animation: shake-animation var(--shake-duration) cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  perspective: 1000px;
}

@keyframes shake-animation {
  0%, 100% { 
    transform: translate3d(0, 0, 0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translate3d(calc(var(--shake-intensity) * -1), 0, 0);
  }
  20%, 40%, 60%, 80% {
    transform: translate3d(var(--shake-intensity), 0, 0);
  }
}
</style>
