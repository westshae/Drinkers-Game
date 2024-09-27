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

  const newLobbyMade = game.addNewLobby(lobbyCode)
  game.addNewPlayersToLobby(lobbyCode, username)

  console.log('New Socket.IO connection');

  socket.on('disconnect', () => {
    game.removePlayerFromLobby(lobbyCode, username)
    game.removeLobbyIfZeroPlayers(lobbyCode)
    console.log('Socket.IO connection disconnected');
  });

  socket.on('answer', (message) => {
    emitRound(socket, game.acceptAnswer(message))
  });
  
  if (newLobbyMade) {
    setInterval(() => {
      let updatedLobbies: string[] = []
      const connectedSockets = io.sockets.sockets;
      connectedSockets.forEach((connectedSocket) => {
        const currentLobbyCode = connectedSocket.handshake.query.lobbyCode?.toString()
        if (currentLobbyCode === lobbyCode) {
          const currentRoundType = game.getRoundType(lobbyCode)

          if (!updatedLobbies.includes(currentLobbyCode)) {
            switch (currentRoundType) {
              case "instruction":
                game.setNewRoundData(lobbyCode)
                game.setNextRoundType(lobbyCode, "quiz")
                updatedLobbies.push(currentLobbyCode)
                break;
              case "quiz":
                game.setNewRoundData(lobbyCode)
                game.setNextRoundType(lobbyCode, "instruction")
                updatedLobbies.push(currentLobbyCode)
                break;
            }
          }

          emitRound(connectedSocket, game.getRoundEmitQuestion(lobbyCode))
          return;
        }
      });

      console.log(`Interval: ${lobbyCode}`);

    }, 15 * 1000)
  }
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
