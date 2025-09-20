import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import formRoutes from "./routes/form.routes";
import answerRoutes from "./routes/answer.routes";
import resultRoutes from "./routes/result.routes";
import profileInvest from "./routes/profile.routes";
import userRoutes from "./routes/user.routes";
import cryptoRoutes from "./routes/agressivoRoutes/crypto.routes";
import tesouroRoutes from "./routes/convervadorRoutes/tesouro.routes";
import { AcoesMercado } from "./controllers/controllers.moderado/actions.controller";
import emergingTechRoutes from "./routes/agressivoRoutes/emergingTech.routes";
import { logoutUser } from "./controllers/logout.controller";
import financeRoutes from "./routes/finance.routes";
import chatRoutes from "./routes/ai.routes";
import tipsRoutes from "./routes/tips.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/formulario", formRoutes);
app.use("/api/respostas", answerRoutes);
app.use("/api/resultado", resultRoutes);
app.use("/api/perfil", profileInvest);
app.use("/api/usuario", userRoutes);
app.use("/api/cripto", cryptoRoutes);
app.use("/api", tesouroRoutes);
app.use("/api/acoes", AcoesMercado);
app.use("/api/stocks", emergingTechRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api", chatRoutes);
app.post("/api/logout", logoutUser);
app.use("/api/dicas", tipsRoutes);

// Rota padrão
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Servidor rodando com sucesso!",
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

export default app;
