// controllers/answer.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { RespostaUsuario } from "../entities/RespostaUsuario";
import { Opcao } from "../entities/Opcao";
import { ResultadoUsuario } from "../entities/ResultadoUsuario";

type RespostaInput = {
  idPergunta: number;
  idOpcao: number;
};

export const salvarRespostas = async (req: Request, res: Response) => {
  try {
    const { idUsuario, respostas } = req.body as { idUsuario: number; respostas: RespostaInput[] };

    if (!idUsuario || !respostas || !Array.isArray(respostas)) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const respostaRepo = AppDataSource.getRepository(RespostaUsuario);
    const opcaoRepo = AppDataSource.getRepository(Opcao);
    const resultadoRepo = AppDataSource.getRepository(ResultadoUsuario);

    const usuario = await usuarioRepo.findOne({ where: { id: idUsuario } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Remove respostas anteriores
    await respostaRepo.delete({ idUsuario });

    // Salva novas respostas
    const respostasCriadas = await Promise.all(
      respostas.map((r) =>
        respostaRepo.save(
          respostaRepo.create({
            idUsuario,
            idPergunta: r.idPergunta,
            idOpcao: r.idOpcao,
          })
        )
      )
    );

    // Calcula pontuação total
    const opcoes = await opcaoRepo.findByIds(respostas.map((r) => r.idOpcao));
    const pontuacaoTotal = opcoes.reduce((acc, opcao) => acc + (opcao.pontuacao ?? 0), 0);

    // Determina perfil
    let perfilId: number;
    if (pontuacaoTotal <= 10) perfilId = 1;
    else if (pontuacaoTotal <= 20) perfilId = 2;
    else perfilId = 3;

    // Atualiza ou cria resultado
    let resultado = await resultadoRepo.findOne({ where: { idUsuario } });
    if (resultado) {
      resultado.idPerfil = perfilId;
      resultado.pontuacaoTotal = pontuacaoTotal;
      resultado.dataClassificacao = new Date();
      await resultadoRepo.save(resultado);
    } else {
      resultado = resultadoRepo.create({
        idUsuario,
        idPerfil: perfilId,
        pontuacaoTotal,
        dataClassificacao: new Date(),
      });
      await resultadoRepo.save(resultado);
    }

    return res
      .status(201)
      .json({ message: "Respostas salvas e perfil calculado", perfilId, pontuacaoTotal, respostas: respostasCriadas });
  } catch (error) {
    console.error("Erro no salvarRespostas:", error);
    return res.status(500).json({ error: "Erro ao salvar respostas e calcular perfil" });
  }
};
