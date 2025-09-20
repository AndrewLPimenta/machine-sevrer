import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { ResultadoUsuario } from "../entities/ResultadoUsuario"
import { Pergunta } from "../entities/Pergunta"
import { RespostaUsuario } from "../entities/RespostaUsuario"

// Buscar perfil do usuário
export const getPerfilUsuario = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params

    const repoResultado = AppDataSource.getRepository(ResultadoUsuario)
    const repoPergunta = AppDataSource.getRepository(Pergunta)

    const resultado = await repoResultado.findOne({
      where: { idUsuario: Number(idUsuario) },
      relations: ["perfil"],
    })

    if (!resultado) {
      return res.status(404).json({ error: "Resultado não encontrado" })
    }

    // Buscar todas as perguntas com opções
    const perguntas = await repoPergunta.find({ relations: ["opcoes"] })

    const pontuacaoMaxima = perguntas.reduce((sum, p) => {
      if (!p.opcoes || p.opcoes.length === 0) return sum
      const maxOpcao = Math.max(...p.opcoes.map(o => o.pontuacao))
      return sum + maxOpcao
    }, 0)

    const percentual = (resultado.pontuacaoTotal / pontuacaoMaxima) * 100

    res.json({
      perfil: resultado.perfil,
      pontuacao: resultado.pontuacaoTotal,
      percentual: Math.round(percentual),
      dataClassificacao: resultado.dataClassificacao,
    })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    res.status(500).json({ error: "Erro ao buscar perfil" })
  }
}

// Calcular perfil do usuário
export const calcularPerfil = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.body as { idUsuario: number }

    if (!idUsuario) {
      return res.status(400).json({ error: "idUsuario é obrigatório" })
    }

    const repoResposta = AppDataSource.getRepository(RespostaUsuario)
    const repoPergunta = AppDataSource.getRepository(Pergunta)
    const repoResultado = AppDataSource.getRepository(ResultadoUsuario)

    // Buscar respostas do usuário com opções selecionadas
    const respostas = await repoResposta.find({
      where: { idUsuario },
      relations: ["opcao"],
    })

    if (respostas.length === 0) {
      return res.status(400).json({ error: "Usuário não possui respostas" })
    }

    // Somar pontuação total
    const totalPontuacao = respostas.reduce(
      (sum, r) => sum + (r.opcao?.pontuacao ?? 0),
      0
    )

    // Buscar todas as perguntas para calcular pontuação máxima real
    const perguntas = await repoPergunta.find({ relations: ["opcoes"] })
    const pontuacaoMaxima = perguntas.reduce((sum, p) => {
      if (!p.opcoes || p.opcoes.length === 0) return sum
      const maxOpcao = Math.max(...p.opcoes.map(o => o.pontuacao))
      return sum + maxOpcao
    }, 0)

    // Percentual baseado na pontuação máxima real
    const percentual = (totalPontuacao / pontuacaoMaxima) * 100

    // Determinar perfil com limites ajustados
    let idPerfil: number
    if (percentual <= 46) idPerfil = 1 // Conservador
    else if (percentual <= 70) idPerfil = 2 // Moderado
    else idPerfil = 3 // Agressivo

    // Buscar resultado existente
    let resultado = await repoResultado.findOne({ where: { idUsuario } })

    if (resultado) {
      // Update
      resultado.idPerfil = idPerfil
      resultado.pontuacaoTotal = totalPontuacao
      resultado.dataClassificacao = new Date()
    } else {
      // Create
      resultado = repoResultado.create({
        idUsuario,
        idPerfil,
        pontuacaoTotal: totalPontuacao,
        dataClassificacao: new Date(),
      })
    }

    await repoResultado.save(resultado)

    res.json({
      message: "Perfil calculado com sucesso",
      perfilId: idPerfil,
      pontuacao: totalPontuacao,
      percentual: Math.round(percentual),
    })
  } catch (error) {
    console.error("Erro ao calcular perfil:", error)
    res.status(500).json({ error: "Erro ao calcular perfil" })
  }
}
