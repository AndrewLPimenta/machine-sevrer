import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import formRoutes from './routes/form.routes';
import answerRoutes from './routes/answer.routes';
import resultRoutes from './routes/result.routes';
import profileInvest from './routes/profile.routes';
import userRoutes from "./routes/user.routes";
import cryptoRoutes from './routes/agressivoRoutes/crypto.routes';
import tesouroRoutes from './routes/convervadorRoutes/tesouro.routes';
import { AcoesMercado } from './controllers/controllers.moderado/actions.controller';
import emergingTechRoutes from "./routes/agressivoRoutes/emergingTech.routes";
import { logoutUser } from "./controllers/logout.controller";
import financeRoutes from './routes/finance.routes';
import chatRoutes from "./routes/ai.routes";
import tipsRoutes from "./routes/tips.route";

import { AppDataSource } from "./data-source";
import { Usuario } from "./entities/Usuario"; // <-- IMPORT CORRIGIDO

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --------------------- Rotas da aplicação ---------------------
app.use('/api/auth', authRoutes);
app.use('/api/formulario', formRoutes);
app.use('/api/respostas', answerRoutes);
app.use('/api/resultado', resultRoutes);
app.use('/api/perfil', profileInvest);
app.use('/api/usuario', userRoutes);
app.use('/api/cripto', cryptoRoutes);
app.use('/api', tesouroRoutes);
app.use('/api/acoes', AcoesMercado);
app.use("/api/stocks", emergingTechRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api", chatRoutes);
app.post("/api/logout", logoutUser);
app.use("/api/dicas", tipsRoutes);

AppDataSource.initialize()
  .then(async () => {
    document.writeln("Data Source initialized");

    const repo = AppDataSource.getRepository(Usuario);
    const users = await repo.find();
    console.log("Usuarios encontrados:", users);
  })
  .catch((err) => console.error("Error during Data Source initialization", err));

export default app;
