import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';



const GameComponent: React.FC = () => {
  const [username, setUsername] = useState<string>('asd');
  const [lobbyCode, setLobbyCode] = useState<string>('asd');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (socket){
      socket.on('connect', () => {
        console.log('Connected to server');
      });
  
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
  
      socket.on('gameStateUpdate', (state: any) => {
        setGameState(state);
      });
  
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('gameStateUpdate');
      };
    }
  }, [socket]);

  const handleSocketDisconnect = () => {
    if (socket === null) return
    socket.disconnect()
  }

  const handleConnectionInit = () => {
    handleSocketDisconnect()
    console.log("Setting socket")
    setSocket(io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    }))
  }

  const handleInputChange = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  }, []);

  return (
    <div>
      <h1>Game Component</h1>
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={handleInputChange(setUsername)} />
        </label>
      </div>
      <div>
        <label>
          Lobby Code:
          <input type="text" value={lobbyCode} onChange={handleInputChange(setLobbyCode)} />
        </label>
      </div>
      <button onClick={handleConnectionInit}>Send Message</button>
      <p>Player ID: {playerId}</p>
      <div>
        <h2>Game State:</h2>
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GameComponent;
