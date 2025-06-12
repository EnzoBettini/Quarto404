const QUARTOS = ["401", "402", "403", "404"]
const STORAGE = "progressoPuzzle"

export const salvarProgressoPuzzle = (numeroQuarto) => {
  try {
    const progressoAtual = JSON.parse(localStorage.getItem(STORAGE)) || {}
    progressoAtual[`quarto${numeroQuarto}`] = {
      completado: true,
      dataCompletado: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE, JSON.stringify(progressoAtual))
    console.log(`Progresso ${numeroQuarto} foi salvo:`, progressoAtual)
  } catch (error) {
    console.error("Erro ao salvar progresso do puzzle", error)
  }
}

export const verificarProgressoPuzzle = (numeroQuarto) => {
  try {
    const progressoAtual = JSON.parse(localStorage.getItem(STORAGE)) || {}
    // A verificação com o ? é pra evitar erros de undefined
    return progressoAtual[`quarto${numeroQuarto}`]?.completado || false
  } catch (error) {
    console.error(`Erro ao verificar o progresso do puzzle (${numeroQuarto})`, error)
    return false
  }
}

export const verificarLiberacaoQuarto = (numeroQuarto) => {
  try {
    const enderecoQuarto = QUARTOS.indexOf(numeroQuarto)

    if (enderecoQuarto === -1) {
      console.warn(`Quarto ${numeroQuarto} não é um QUARTO disponível`)
      return false
    }

    if (enderecoQuarto === 0) {
      return true
    }

    for (let i = 0; i < enderecoQuarto; i++) {
      const quartoAnterior = QUARTOS[i]

      if (!verificarProgressoPuzzle(quartoAnterior)) {
        console.warn(`Quarto ${quartoAnterior} não foi completado`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error(`Erro ao verificar liberação do quarto ${numeroQuarto}`, error)
    return false
  }
}

export const verificaQuarto404 = () => {
  return verificarLiberacaoQuarto("404")
}

export const obterProximoQuarto = () => {
  for (const quarto of QUARTOS) {
    if (!verificarProgressoPuzzle(quarto) && verificarLiberacaoQuarto(quarto)) {
      return quarto
    }
  }
  return null
}

export const obterStatusCompleto = () => {
  return QUARTOS.map((quarto) => ({
    numero: quarto,
    completado: verificarProgressoPuzzle(quarto),
    liberado: verificarLiberacaoQuarto(quarto),
    bloqueado: !verificarLiberacaoQuarto(quarto),
  }))
}

export const obterProgressoPercentual = () => {
  const totalQuartos = QUARTOS.length
  const quartosFeitos = QUARTOS.filter((quarto) => verificarProgressoPuzzle(quarto)).length

  return Math.round((quartosFeitos / totalQuartos) * 100)
}

export const verificarJogoCompleto = () => {
  return QUARTOS.every((quarto) => verificarProgressoPuzzle(quarto))
}

export const obterQuartosBloqueados = () => {
  return QUARTOS.filter((quarto) => !verificarLiberacaoQuarto(quarto)).map((quarto) => {
    const indice = QUARTOS.indexOf(quarto)
    const requisito = indice > 0 ? QUARTOS[indice - 1] : null

    return {
      quarto,
      requisito,
      mensagem: requisito ? `Complete o quarto ${requisito} primeiro` : "Quarto não encontrado na sequência",
    }
  })
}

export const obterProgressoCompleto = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || {}
  } catch (error) {
    console.error("Erro ao obter progresso completo", error)
    return {}
  }
}

export const debugProgresso = () => {
  console.group("🎮 DEBUG DO PROCESSO DOS PUZZLES")
  console.log("📊 Status Completo:", obterStatusCompleto())
  console.log("📈 Progresso:", `${obterProgressoPercentual()}%`)
  console.log("🎯 Próximo Quarto:", obterProximoQuarto())
  console.log("🔒 Quartos Bloqueados:", obterQuartosBloqueados())
  console.log("✅ Jogo Completo:", verificarJogoCompleto())
  console.log("💾 Dados Raw:", obterProgressoCompleto())
  console.groupEnd()
}

// Função para limpar o progresso (útil para testes)
export const limparProgresso = () => {
  try {
    localStorage.removeItem(STORAGE)
    console.log("Progresso limpo com sucesso")
  } catch (error) {
    console.error("Erro ao limpar progresso", error)
  }
}
