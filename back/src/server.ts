import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const port = 5000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'], // Ensure these are the same as your client configuration
});

io.on('connection', (socket) => {
  console.log('New Socket.IO connection');
  const { param1, param2 } = socket.handshake.query;
  console.log(`${param1} : ${param2}`)

  socket.on('disconnect', () => {
    console.log('Socket.IO connection disconnected');
  });

  socket.on('message', (message) => {
    console.log(`Received message => ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on('answer', (message) => {
    socket.emit('message', `Answer recieved ${message}`)
    console.log("Answer recieved!")
  })

  // Example of emitting a message from the server every 5 seconds
  setInterval(() => {
    socket.emit('round', JSON.stringify({
      type: "quiz",
      question: "What noise does a cow make?",
      option1: "Oink",
      option2: "Moo",
      option3: "Bark",
      option4: "Meow"
    }))
  }, 10 * 1000);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
