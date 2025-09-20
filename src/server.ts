import "reflect-metadata";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import startBinanceStream from "./ws/binanceStream";
import { AppDataSource } from "./data-source";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Inicializa WebSocket da Binance
async function initBinanceStream() {
  try {
    await startBinanceStream(io);
    console.log("WebSocket da Binance iniciado com sucesso");
  } catch (error: any) {
    console.warn("Não foi possível conectar à Binance. Continuando sem o stream...");
    console.warn(error?.message || error);
  }
}

// Inicializa o TypeORM
async function initDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar o Data Source:", error);
  }
}

// Inicializações
initDatabase();
initBinanceStream();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

// Tratamento de erros não tratados
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
