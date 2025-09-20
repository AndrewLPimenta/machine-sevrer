import "reflect-metadata";
import dotenv from "dotenv";
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import startBinanceStream from './ws/binanceStream';

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Função segura para iniciar o WebSocket da Binance
async function initBinanceStream() {
  try {
    await startBinanceStream(io);
    console.log("WebSocket da Binance iniciado com sucesso");
  } catch (error: any) {
    console.warn("Não foi possível conectar à Binance. Ignorando o erro e continuando...");
    console.warn(error.message || error);
  }
}

initBinanceStream(); // Tenta iniciar o stream da Binance

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
  // Aqui você pode colocar a inicialização do TypeORM / Supabase se necessário
});
