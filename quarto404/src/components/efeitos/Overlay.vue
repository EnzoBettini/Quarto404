
<script setup>

import { itens } from '../../assets/utils/item';

//define o nome da imagem será procurado no item.js, quando usar o overlay, coloque nome = "nomedoitemcriado"
const props = defineProps({
  nome: {
    type: String, 
  }
});
//define a imagem como o item q for encontrado conforme o nome que voce colocou ao chamar a tag <Overlay>
const imagem = itens.find(item => item.nome === props.nome);


</script>

<template>
<!--imagem procurada-->
  <div v-if="imagem" >
    <img :src="imagem.caminhoImagem"  />
  </div>
<!--notificacao caso voce tenha inserido algo errado e ele nao encontra a imagem-->
  <div v-else class="item-nao-encontrado">
    <p>Erro: O item "{{ nome }}" não pôde ser encontrado.</p>
  </div>
</template>

<style scoped>

.item-container img {
  width: 100%; 
  display: block; 
}

.item-nao-encontrado {
  color: red;
  border: 1px dashed red;
  padding: 10px;
}

</style>