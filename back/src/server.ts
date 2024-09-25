import express from 'express';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import Game from './game';

const app = express();
const port = 5000;

const server = http.createServer(app);

const game = new Game();


const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  const { lobbyCode, username } = getParams(socket) || (() => { throw new Error("Invalid parameters: lobbyCode or username is missing."); })()

  game.addNewLobby(lobbyCode)
  game.addNewPlayersToLobby(lobbyCode, username)

  emitRound(socket, game.getRoundEmitQuestion(lobbyCode))

  console.log('New Socket.IO connection');

  socket.on('disconnect', () => { 
    game.removePlayerFromLobby(lobbyCode, username)
    console.log('Socket.IO connection disconnected'); 
    game.removeLobbyIfZeroPlayers(lobbyCode)
  });

  socket.on('answer', (message) => { 
    emitRound(socket, game.acceptAnswer(message))
  });


  setInterval(() => {
    for (const currentLobbyCode of game.getAllLobbyCodes()) {
      const currentRoundType = game.getRoundType(currentLobbyCode)
      game.resetPlayersAnswered(currentLobbyCode)

      switch (currentRoundType) {
        case "instruction":
          console.log("instruction")
          game.setNewRoundData(currentLobbyCode)
          game.setNextRoundType(currentLobbyCode, "quiz")
          emitRound(socket, game.getRoundEmitQuestion(currentLobbyCode))
          break;
        case "quiz":
          console.log("quiz")
          game.setNewRoundData(currentLobbyCode)
          game.setNextRoundType(currentLobbyCode, "instruction")
          emitRound(socket, game.getRoundEmitQuestion(currentLobbyCode))
          break;
      }
    }
    console.log("interval");
  }, 15 * 1000);
});

const emitRound = (socket: Socket, roundData: any) => {
  socket.emit('round', roundData)
}

const getParams = (socket: Socket) => {
  const { lobbyCode, username } = {
    lobbyCode: socket.handshake.query.lobbyCode?.toString(),
    username: socket.handshake.query.username?.toString()
  };

  if (!lobbyCode || !username) return
  return { lobbyCode, username }
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
