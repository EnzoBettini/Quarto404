<template>
  <div class="item-container">
    <button onclick="alert(1)">
      <Overlay nome="televisao_401"/>
    </button>
  </div>
  
  
</template>

<script setup>
import Overlay from '../efeitos/Overlay.vue';


</script>

<style>

.item-container {
 
  position: absolute;
  top: -420%; 
  left: 12%; 
  transform: translate(-50%, -50%); 
  width: 13vw; 
  cursor: pointer;
  pointer-events: auto; 
  border: 3px solid transparent; 
  border-radius: 8px;
  transition: border-color 0.2s ease-in-out; 
}

.item-container:hover {
  border-color: #a7a7a777; 
}
button{
   background: none;

  /* Remove a borda */
  border: none;
  padding: 0;
}
</style>