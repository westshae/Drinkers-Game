import express from 'express';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

const app = express();
const port = 5000;

const server = http.createServer(app);

interface GameState {
  [lobbyCode: string]: {
    lobbyCode: string;
    currentState: {
      roundType: string;
      answer: any;
      playersAnswered: {
        [username: string]: {
          answer: any
        }
      }
    }
    players: {
      [username: string]: {
        score: number;
      };
    };
  };
}

let game: GameState = {}

const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  console.log('New Socket.IO connection');

  socket.on('disconnect', () => { console.log('Socket.IO connection disconnected'); });

  socket.on('answer', (message) => {
    acceptAnswer(message)
  })
  // const { lobbyCode, username } = socket.handshake.query;
  // console.log("test" + socket.handshake.query["lobbyCode"])
  // console.log(socket.handshake.query)

  // if (!(typeof lobbyCode === 'string' && typeof username === 'string')) return

  // console.log("connection socket on")
  // console.log(`${lobbyCode} ${username}`)

  console.log("connection")
  const { lobbyCode, username } = {
    lobbyCode: socket.handshake.query.lobbyCode?.toString(),
    username: socket.handshake.query.username?.toString()
  };

  if (!lobbyCode || !username) return
  if (!(lobbyCode in game)) {
    game[lobbyCode] = {
      lobbyCode: lobbyCode,
      currentState: {
        roundType: "init",
        playersAnswered: {},
        answer: undefined
      },
      players: {}
    }
  }

  if (!(username in game[lobbyCode].players)) {
    game[lobbyCode].players[username] = {
      score: 0
    }
  }
  setInterval(() => {
    for (const currentLobby of Object.keys(game)) {
      switch (game[currentLobby].currentState.roundType) {
        case "init":
          setQuizRound(currentLobby, socket)
          break;
        case "quiz":
          if (Object.keys(game[currentLobby].players).length === Object.keys(game[currentLobby].currentState.playersAnswered).length){
            //all answered
            scorePlayers(lobbyCode)
            setLeaderboardRound(lobbyCode, socket)
          }
          break;
        case "leaderboard":
          setQuizRound(currentLobby, socket)
          break;
      }
    }
    console.log("interval");
  }, 5 * 1000);
});

const setLeaderboardRound: (lobbyCode: string, socket: Socket) => void = (lobbyCode: string, socket: Socket) => {
  game[lobbyCode].currentState = {
    roundType: "leaderboard",
    playersAnswered: {},
    answer: 0
  }

  const players = Object.entries(game[lobbyCode].players)
  .map(([username, { score }]) => ({ username, score }));

  // Sort the players by score in descending order
  players.sort((a, b) => b.score - a.score);


  socket.emit('round', JSON.stringify({
    type: "leaderboard",
    players: players
  }))
}

const setQuizRound: (lobbyCode: string, socket: Socket) => void = (lobbyCode: string, socket: Socket) => {
  game[lobbyCode].currentState = {
    roundType: "quiz",
    playersAnswered: {},
    answer: 1
  }

  socket.emit('round', JSON.stringify({
    type: "quiz",
    question: "What noise does a cow make?",
    option1: "Oink",
    option2: "Moo",
    option3: "Bark",
    option4: "Meow"
  }))
}

const acceptAnswer = (message: string) => {
  const parsed = JSON.parse(message)
  const { lobbyCode, username, answer } = parsed
  if (lobbyCode in game && username in game[lobbyCode].players && !(username in game[lobbyCode].currentState.playersAnswered)) { // Username not in answers
    game[lobbyCode].currentState.playersAnswered[username] = {
      answer: answer
    }
  }
}

const scorePlayers = (lobbyCode: string) => {
  const answer = game[lobbyCode].currentState.answer
  for (let username of Object.keys(game[lobbyCode].currentState.playersAnswered)){
    const playerAnswer = game[lobbyCode].currentState.playersAnswered[username].answer
    if (answer === playerAnswer){
      game[lobbyCode].players[username].score += 1
    }
  }
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
