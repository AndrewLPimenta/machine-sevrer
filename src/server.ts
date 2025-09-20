import "reflect-metadata"; // Sempre no topo
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import startBinanceStream from './ws/binanceStream';
import { AppDataSource } from './data-source'; // seu TypeORM DataSource

dotenv.config();

async function startServer() {
  try {
    // Inicializa o banco de dados
    await AppDataSource.initialize();
    console.log("Banco de dados conectado com sucesso!");

    // Cria o servidor HTTP
    const server = http.createServer(app);

    // Configura o Socket.IO
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Inicia o stream da Binance
    startBinanceStream(io);

    // Porta
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta: ${PORT}`);
    });

  } catch (err) {
    console.error("Erro ao inicializar o servidor:", err);
    process.exit(1); // encerra o processo se o DB não conectar
  }
}

startServer();
