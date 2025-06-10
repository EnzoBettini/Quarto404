/* Pessoal aqui será o arquivo do que será
    clicável no jogo, ou seja, itens que o jogador poderá
    clicar e interagir precisam ser recortados do fundo 
    e colados o png do objeto aqui com o nome de marcação
*/
// O CAMINHO DA PASTA DE IMAGENS PROS ITENS: assets/images/itens
export const itens = [
    {
        nome:'televisao_401',
        caminhoImagem:'/itens/televisao_401.png',
        //a pasta não deve possuir o caminho ../, visto que ele nao suporta esse tipo de procura, por isso
        //a pasta itens foi transferida para o public, por favor inserir as imagens de overlay para a pasta 
        //itens
    },
    {
        nome:'geladeira_402',
        caminhoImagem:'/itens/geladeira_402.png',
    },
    {
        nome:'quarto401',
        caminhoImagem:'/itens/quarto401.png',
    },
    {
        nome:'quarto402',
        caminhoImagem:'/itens/quarto402.png',
    },
    {
        nome:'quarto403',
        caminhoImagem:'/itens/quarto403.png',
    },
    {
        nome:'quarto404',
        caminhoImagem:'/itens/quarto404.png',
    }
]
