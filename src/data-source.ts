import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Usuario } from "./entities/Usuario";
import { CategoriaGasto } from "./entities/CategoriaGasto";
import { Gasto } from "./entities/Gasto";
import { Investimento } from "./entities/Investimento";
import { TipoInvestimento } from "./entities/TipoInvestimento";
import { Formulario } from "./entities/Formulario";
import { Pergunta } from "./entities/Pergunta";
import { Opcao } from "./entities/Opcao";
import { RespostaUsuario } from "./entities/RespostaUsuario";
import { PerfilInvestidor } from "./entities/PerfilInvestidor";
import { ResultadoUsuario } from "./entities/ResultadoUsuario";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL não encontrada no .env");
}

const isProd = process.env.NODE_ENV === "production";
const dbUrl = new URL(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbUrl.hostname,
  port: Number(dbUrl.port || 5432),
  username: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  ssl: isProd ? { rejectUnauthorized: false } : false,
  extra: { family: 4 }, // força IPv4
  synchronize: !isProd,
  logging: !isProd,
  entities: isProd
    ? [__dirname + "/entities/*.js"]
    : [
        Usuario,
        CategoriaGasto,
        Gasto,
        Investimento,
        TipoInvestimento,
        Formulario,
        Pergunta,
        Opcao,
        RespostaUsuario,
        PerfilInvestidor,
        ResultadoUsuario,
      ],
  migrations: isProd
    ? [__dirname + "/migrations/*.js"]
    : [__dirname + "/migrations/*.ts"],
  subscribers: [],
});
