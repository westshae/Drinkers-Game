import express from 'express';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import Game from './Game';

const app = express();
const port = 5000;

const server = http.createServer(app);

const game = new Game();


const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  console.log('New Socket.IO connection');

  socket.on('disconnect', () => { console.log('Socket.IO connection disconnected'); });

  socket.on('answer', (message) => { game.acceptAnswer(message) })

  const { lobbyCode, username } = getParams(socket) || (() => { throw new Error("Invalid parameters: lobbyCode or username is missing."); })()

  game.addNewLobby(lobbyCode)
  game.addNewPlayersToLobby(lobbyCode, username)

  emitRound(socket, game.getRoundEmitQuestion(lobbyCode))

  setInterval(() => {
    for (const currentLobbyCode of game.getAllLobbyCodes()) {
      console.log(JSON.stringify(game))
      console.log(!game.alreadyDisplayedLeaderboard(currentLobbyCode))
      console.log(game.haveAllPlayersAnswered(currentLobbyCode))
      if (!game.alreadyDisplayedLeaderboard(currentLobbyCode) && game.haveAllPlayersAnswered(currentLobbyCode)) {
        game.scorePlayers(currentLobbyCode)
        emitRound(socket, game.getLeaderboard(currentLobbyCode))
      }
    }
  }, 1 * 1000)

  setInterval(() => {
    for (const currentLobbyCode of game.getAllLobbyCodes()) {
      const currentRoundType = game.getRoundType(currentLobbyCode)
      switch (currentRoundType) {
        case "instruction":
          game.setNewRoundData(currentLobbyCode, "quiz")
          emitRound(socket, game.getRoundEmitQuestion(currentLobbyCode))

          break;
        case "quiz":
          game.setNewRoundData(currentLobbyCode, "instruction")
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
