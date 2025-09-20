import "reflect-metadata"; // Sempre no topo, antes de qualquer entidade TypeORM
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import startBinanceStream from './ws/binanceStream';


dotenv.config(); // Carregando as variáveis de ambiente do arquivo .env

const server = http.createServer(app); // Criando o servidor HTTP a partir do aplicativo Express

// Configurando o Socket.IO para o servidor HTTP (comunicação em tempo real)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
 // Iniciando o stream (api) da Binance para enviar dados em tempo real
startBinanceStream(io);

// Definindo a porta do servidor a partir das variáveis de ambiente (ambiente de desenvolvimento por enquanto)
const PORT =  process.env.PORT || 3001;

// Iniciando o servidor e escutando na porta definida
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
