import "reflect-metadata";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { AppDataSource } from "./data-source";
// import startBinanceStream from "./ws/binanceStream"; // opcional, desativado no Render

dotenv.config();

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Inicializa TypeORM
AppDataSource.initialize()
  .then(() => console.log("Data Source inicializado com sucesso"))
  .catch((err) => console.error("Erro ao inicializar o Data Source:", err));

// Inicializa WebSocket da Binance (opcional)
// async function initBinanceStreamSafe() {
//   try {
//     await startBinanceStream(io);
//     console.log("WebSocket da Binance iniciado");
//   } catch (err: any) {
//     console.warn("Não foi possível conectar à Binance:", err.message || err);
//   }
// }
// initBinanceStreamSafe();

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

// Tratamento de erros globais
process.on("unhandledRejection", (reason) => console.error("Unhandled Rejection:", reason));
process.on("uncaughtException", (error) => console.error("Uncaught Exception:", error));
