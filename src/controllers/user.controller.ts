import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { ResultadoUsuario } from "../entities/ResultadoUsuario";
import { PerfilInvestidor } from "../entities/PerfilInvestidor";
import { RespostaUsuario } from "../entities/RespostaUsuario";
import { Pergunta } from "../entities/Pergunta";
import { Opcao } from "../entities/Opcao";

export const getUsuario = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuarioRepo = AppDataSource.getRepository(Usuario);

    const usuario = await usuarioRepo.findOne({
      where: { id },
      relations: [
        "resultados",
        "resultados.perfil",
        "respostas",
        "respostas.pergunta",
        "respostas.opcao",
      ],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};
