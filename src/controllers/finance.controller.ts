// controllers/finance.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Gasto } from "../entities/Gasto";
import { CategoriaGasto } from "../entities/CategoriaGasto";
import { TipoInvestimento } from "../entities/TipoInvestimento";
import { Investimento } from "../entities/Investimento";

export interface AuthRequest<
  P = any,       // params
  ResBody = any, // response body
  ReqBody = any, // request body
  ReqQuery = any // query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: number;
}

export const financeController = {
  // ======================
  // GASTOS
  // ======================
async createExpense(req: AuthRequest, res: Response) {
  try {
    const { valor, descricao, idCategoria, tipoPeriodo, dataGasto } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

    const repo = AppDataSource.getRepository(Gasto);
    const gasto = repo.create({
      idUsuario: userId,
      valor: parseFloat(valor),
      descricao,
      idCategoria: idCategoria ? Number(idCategoria) : undefined,
      tipoPeriodo,
      dataGasto: dataGasto ? new Date(dataGasto) : new Date(),
    });
    await repo.save(gasto);

    const gastoFull = await repo.findOne({ where: { id: gasto.id }, relations: ["categoria"] });

    res.status(201).json({ success: true, data: gastoFull, message: "Gasto criado com sucesso" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

,
  async getExpenses(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const { page = 1, limit = 10, startDate, endDate, categoria } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const repo = AppDataSource.getRepository(Gasto);
      const qb = repo
        .createQueryBuilder("g")
        .leftJoinAndSelect("g.categoria", "c")
        .where("g.idUsuario = :userId", { userId });

      if (startDate) qb.andWhere("g.dataGasto >= :startDate", { startDate: new Date(startDate as string) });
      if (endDate) qb.andWhere("g.dataGasto <= :endDate", { endDate: new Date(endDate as string) });
      if (categoria) qb.andWhere("g.idCategoria = :categoria", { categoria: Number(categoria) });

      const [gastos, total] = await qb
        .orderBy("g.dataGasto", "DESC")
        .skip(skip)
        .take(Number(limit))
        .getManyAndCount();

      res.json({
        success: true,
        data: gastos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

async updateExpense(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { valor, descricao, idCategoria, tipoPeriodo, dataGasto } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

    const repo = AppDataSource.getRepository(Gasto);
    const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
    if (!existing) return res.status(404).json({ success: false, message: "Gasto não encontrado" });

    repo.merge(existing, {
      valor: valor !== undefined ? parseFloat(valor) : existing.valor,
      descricao: descricao ?? existing.descricao,
      idCategoria: idCategoria ? Number(idCategoria) : undefined,
      tipoPeriodo: tipoPeriodo ?? existing.tipoPeriodo,
      dataGasto: dataGasto ? new Date(dataGasto) : existing.dataGasto,
    });
    await repo.save(existing);

    const gastoFull = await repo.findOne({ where: { id: existing.id }, relations: ["categoria"] });

    res.json({ success: true, data: gastoFull, message: "Gasto atualizado com sucesso" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
  ,

  async deleteExpense(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(Gasto);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Gasto não encontrado" });

      await repo.remove(existing);
      res.json({ success: true, message: "Gasto deletado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ======================
  // CATEGORIAS DE GASTOS
  // ======================
  async createCategory(req: AuthRequest, res: Response) {
    try {
      const { nome, descricao } = req.body;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(CategoriaGasto);
      const categoria = repo.create({ nome, descricao, idUsuario: userId });
      await repo.save(categoria);

      res.status(201).json({ success: true, data: categoria, message: "Categoria criada com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCategories(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(CategoriaGasto);
      const categorias = await repo.find({ where: { idUsuario: userId }, order: { nome: "ASC" } });

      res.json({ success: true, data: categorias });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(CategoriaGasto);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Categoria não encontrada" });

      repo.merge(existing, { nome, descricao });
      await repo.save(existing);

      res.json({ success: true, data: existing, message: "Categoria atualizada com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(CategoriaGasto);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Categoria não encontrada" });

      await repo.remove(existing);
      res.json({ success: true, message: "Categoria deletada com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ======================
  // TIPOS DE INVESTIMENTO
  // ======================
  async createInvestmentType(req: AuthRequest, res: Response) {
    try {
      const { nome, descricao } = req.body;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(TipoInvestimento);
      const tipo = repo.create({ nome, descricao, idUsuario: userId });
      await repo.save(tipo);

      res.status(201).json({ success: true, data: tipo, message: "Tipo de investimento criado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getInvestmentTypes(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(TipoInvestimento);
      const tipos = await repo.find({ where: { idUsuario: userId }, order: { nome: "ASC" } });

      res.json({ success: true, data: tipos });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateInvestmentType(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(TipoInvestimento);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Tipo de investimento não encontrado" });

      repo.merge(existing, { nome, descricao });
      await repo.save(existing);

      res.json({ success: true, data: existing, message: "Tipo de investimento atualizado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteInvestmentType(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(TipoInvestimento);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Tipo de investimento não encontrado" });

      await repo.remove(existing);
      res.json({ success: true, message: "Tipo de investimento deletado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ======================
  // INVESTIMENTOS
  // ======================
async createInvestment(req: AuthRequest, res: Response) {
  try {
    const { valor, descricao, idTipoInvestimento, dataInvestimento } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

    const repo = AppDataSource.getRepository(Investimento);
    const investimento = repo.create({
      idUsuario: userId,
      valor: parseFloat(valor),
      descricao,
      idTipoInvestimento: idTipoInvestimento ? Number(idTipoInvestimento) : undefined,
      dataInvestimento: dataInvestimento ? new Date(dataInvestimento) : new Date(),
    });
    await repo.save(investimento);

    const investimentoFull = await repo.findOne({ where: { id: investimento.id }, relations: ["tipoInvestimento"] });

    res.status(201).json({ success: true, data: investimentoFull, message: "Investimento criado com sucesso" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
  ,

  async getInvestments(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const { page = 1, limit = 10, startDate, endDate, tipo } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const repo = AppDataSource.getRepository(Investimento);
      const qb = repo
        .createQueryBuilder("i")
        .leftJoinAndSelect("i.tipoInvestimento", "t")
        .where("i.idUsuario = :userId", { userId });

      if (startDate) qb.andWhere("i.dataInvestimento >= :startDate", { startDate: new Date(startDate as string) });
      if (endDate) qb.andWhere("i.dataInvestimento <= :endDate", { endDate: new Date(endDate as string) });
      if (tipo) qb.andWhere("i.idTipoInvestimento = :tipo", { tipo: Number(tipo) });

      const [investimentos, total] = await qb
        .orderBy("i.dataInvestimento", "DESC")
        .skip(skip)
        .take(Number(limit))
        .getManyAndCount();

      res.json({
        success: true,
        data: investimentos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateInvestment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { valor, descricao, idTipoInvestimento, dataInvestimento } = req.body;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(Investimento);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Investimento não encontrado" });

      repo.merge(existing, {
        valor: valor !== undefined ? parseFloat(valor) : existing.valor,
        descricao: descricao ?? existing.descricao,
        idTipoInvestimento: idTipoInvestimento ? Number(idTipoInvestimento) : existing.idTipoInvestimento,
        dataInvestimento: dataInvestimento ? new Date(dataInvestimento) : existing.dataInvestimento,
      });
      await repo.save(existing);

      const investimentoFull = await repo.findOne({ where: { id: existing.id }, relations: ["tipoInvestimento"] });

      res.json({ success: true, data: investimentoFull, message: "Investimento atualizado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteInvestment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const repo = AppDataSource.getRepository(Investimento);
      const existing = await repo.findOne({ where: { id: Number(id), idUsuario: userId } });
      if (!existing) return res.status(404).json({ success: false, message: "Investimento não encontrado" });

      await repo.remove(existing);
      res.json({ success: true, message: "Investimento deletado com sucesso" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ======================
  // RESUMO FINANCEIRO
  // ======================
  async getFinancialSummary(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Usuário não autenticado" });

      const { startDate, endDate } = req.query;

      const gastoRepo = AppDataSource.getRepository(Gasto);
      const investimentoRepo = AppDataSource.getRepository(Investimento);

      // TOTAL GASTOS
      const totalGastos = await gastoRepo
        .createQueryBuilder("g")
        .select("SUM(g.valor)", "total")
        .where("g.idUsuario = :userId", { userId })
        .andWhere(startDate ? "g.dataGasto >= :startDate" : "1=1", { startDate })
        .andWhere(endDate ? "g.dataGasto <= :endDate" : "1=1", { endDate })
        .getRawOne();

      // TOTAL INVESTIMENTOS
      const totalInvestimentos = await investimentoRepo
        .createQueryBuilder("i")
        .select("SUM(i.valor)", "total")
        .where("i.idUsuario = :userId", { userId })
        .andWhere(startDate ? "i.dataInvestimento >= :startDate" : "1=1", { startDate })
        .andWhere(endDate ? "i.dataInvestimento <= :endDate" : "1=1", { endDate })
        .getRawOne();

      // GASTOS POR CATEGORIA
      const gastosPorCategoria = await gastoRepo
        .createQueryBuilder("g")
        .select("c.nome", "categoria")
        .addSelect("SUM(g.valor)", "total")
        .leftJoin("g.categoria", "c")
        .where("g.idUsuario = :userId", { userId })
        .andWhere(startDate ? "g.dataGasto >= :startDate" : "1=1", { startDate })
        .andWhere(endDate ? "g.dataGasto <= :endDate" : "1=1", { endDate })
        .groupBy("c.nome")
        .getRawMany();

      // INVESTIMENTOS POR TIPO
      const investimentosPorTipo = await investimentoRepo
        .createQueryBuilder("i")
        .select("t.nome", "tipo")
        .addSelect("SUM(i.valor)", "total")
        .leftJoin("i.tipoInvestimento", "t")
        .where("i.idUsuario = :userId", { userId })
        .andWhere(startDate ? "i.dataInvestimento >= :startDate" : "1=1", { startDate })
        .andWhere(endDate ? "i.dataInvestimento <= :endDate" : "1=1", { endDate })
        .groupBy("t.nome")
        .getRawMany();

      res.json({
        success: true,
        data: {
          totalGastos: parseFloat(totalGastos?.total || 0),
          totalInvestimentos: parseFloat(totalInvestimentos?.total || 0),
          gastosPorCategoria: gastosPorCategoria.map((g) => ({ categoria: g.categoria, total: parseFloat(g.total) })),
          investimentosPorTipo: investimentosPorTipo.map((i) => ({ tipo: i.tipo, total: parseFloat(i.total) })),
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
