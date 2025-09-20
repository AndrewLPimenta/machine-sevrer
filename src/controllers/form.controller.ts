import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Formulario } from "../entities/Formulario";

export const getFormulario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const repo = AppDataSource.getRepository(Formulario);

    // Busca o formulário com perguntas e opções, respeitando o nome da FK
    const formulario = await repo.findOne({
      where: { id: Number(id) },
      relations: {
        perguntas: {
          opcoes: true,
        },
      },
    });

    if (!formulario) {
      return res.status(404).json({ error: "Formulário não encontrado" });
    }

    res.json(formulario);
  } catch (error: any) {
    console.error("Erro no getFormulario:", error);
    res.status(500).json({ error: "Erro ao buscar formulário" });
  }
};
