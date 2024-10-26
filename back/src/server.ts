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

  console.log('New Socket.IO connection');

  socket.on('disconnect', () => {
    game.disconnectSafely(lobbyCode, username)
    console.log('Socket.IO connection disconnected');
  });

  socket.on('answer', (message) => {
    emitRound(socket, game.acceptAnswer(message))
  });

});

setInterval(() => {
  const socketsWithUniqueLobbyCodes = new Set<Socket>();
  const connectedSockets = io.sockets.sockets;

  connectedSockets.forEach((connectedSocket) => {
    const { lobbyCode = null, username = null } = getParams(connectedSocket) || {}
    if (lobbyCode && username) {
      socketsWithUniqueLobbyCodes.add(connectedSocket)
    } else {
      connectedSocket.disconnect()
    }
  });

  for (const connectedSocket of socketsWithUniqueLobbyCodes) {
    const { lobbyCode = null, username = null } = getParams(connectedSocket) || {}
    if (lobbyCode && username) {
      const roundType = game.getRoundType(lobbyCode)
      if (!roundType){
        connectedSocket.disconnect()
      } else {
        game.setNewRoundData(lobbyCode)
        game.setRandomNextRoundType(lobbyCode)
      }
    }
  }

  connectedSockets.forEach((connectedSocket) => {
    const currentLobbyCode = connectedSocket.handshake.query.lobbyCode?.toString();
    if (currentLobbyCode) {
      emitRound(connectedSocket, game.getRoundEmitQuestion(currentLobbyCode))
    }
  })
}, 60000)//10 minutes 600000

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
