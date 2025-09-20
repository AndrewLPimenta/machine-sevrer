import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { PerfilInvestidor } from "../entities/PerfilInvestidor"

export const getTipos = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PerfilInvestidor)

    const tipos = await repo.find({
      order: { nomePerfil: "ASC" }, // opcional, para organizar
    })

    res.json(tipos)
  } catch (error: any) {
    console.error("Erro ao buscar tipos:", error)
    res.status(500).json({ error: "Erro ao buscar tipos" })
  }
}
