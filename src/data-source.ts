import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Importa entidades diretamente (para dev com TS)
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

// Detecta se está em produção (Render) ou em dev
const isProd = process.env.NODE_ENV === "production";

// Lê URL do banco do Supabase
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL não encontrada no .env");
}
const dbUrl = new URL(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbUrl.hostname,
  port: Number(dbUrl.port || 5432),
  username: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false, // Supabase exige SSL
  },
  extra: {
    family: 4, // força IPv4 → evita erro ENETUNREACH no Render
  },
  synchronize: !isProd, // em dev: true, em prod: false
  logging: !isProd, // log detalhado só em dev
  entities: isProd
    ? [__dirname + "/entities/*.js"] // Render → usa arquivos já compilados no dist
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
  migrations: [__dirname + "/migrations/*{.ts,.js}"], // se você criar migrations
  subscribers: [],
});
