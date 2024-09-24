import { Box, Typography, FormControl, InputLabel, Input, Button, Container, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import React, { useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const GameComponent: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const [roundData, setRoundData] = useState<any>({})
  const [isQuiz, setIsQuiz] = useState<boolean>(false)
  const [isAnswer, setIsAnswer] = useState<boolean>(false)
  const [isInstruction, setIsInstruction] = useState<boolean>(false)
  const [isInit, setIsInit] = useState<boolean>(false)

  const resetRoundTypeStates = () => {
    setIsAnswer(false)
    setIsQuiz(false)
    setIsInstruction(false)
    setIsInit(false)
  }

  const handleConnectionInit = useCallback(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      query: {
        lobbyCode: lobbyCode,
        username: username
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('round', (data: {type: string, question: string}) => {
      console.log(data)

      switch (data.type) {
        case "init":
          resetRoundTypeStates()
          setIsInit(true)
          setRoundData(data)
          break;
        case "quiz":
          resetRoundTypeStates()
          setIsQuiz(true)
          setRoundData(data)
          break;
        case "answer":
          resetRoundTypeStates()
          setIsAnswer(true)
          setRoundData(data)
          break;
        case "instruction":
          resetRoundTypeStates()
          setIsInstruction(true)
          setRoundData(data)
          break;
      }
    })

    newSocket.on('message', (message: string) => {
      console.log(message);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [lobbyCode, username]);

  const handleSocketDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      console.log("Socket disconnected");
    }
  };

  const handleQuizAnswer = (option: number) => {
    if (socket === null) return
    const answer = {
      username: username,
      lobbyCode: lobbyCode,
      answer: option
    }
    socket.emit("answer", JSON.stringify(answer))
    setIsQuiz(false)
    setRoundData({})
  }
  const handleInstructionAnswer = () => {
    if (socket === null) return
    const answer = {
      username: username,
      lobbyCode: lobbyCode,
      answer: 0
    }
    socket.emit("answer", JSON.stringify(answer))
    setIsInstruction(false)
    setRoundData({})
  }

  const AnswerComponent = () => {
    return (
      <Box>
        <Typography variant='h6'>Answer</Typography>
        {roundData.correct &&
          <Typography variant='h4'>Just escaped drinking, lucky you.</Typography>
        }
        {!roundData.correct &&
          <Typography variant='h4'>You failed! Drink up!</Typography>
        }
      </Box>
    )
  }

  const InstructionComponent = () => {
    return (
      <Box>
        <Typography variant='h6'>Instruction</Typography>
        <Typography variant='h6'>{roundData.instruction}</Typography>
        <Button variant="contained" onClick={() => handleInstructionAnswer()}>
          Click on completion
        </Button>
      </Box>
    )
  }
  const InitComponent = () => {
    return (
      <Box>
        <Typography variant='h6'>Welcome</Typography>
        <Typography variant='h6'>{roundData.question}</Typography>
      </Box>
    )
  }
  const QuizComponent = () => {
    return (
      <Box>
        <Typography variant='h6'>Quiz</Typography>
        <Typography variant='h6'>{roundData.question}</Typography>
        <Button variant="contained" onClick={() => handleQuizAnswer(1)}>
          {roundData.option1}
        </Button>
        <Button variant="contained" onClick={() => handleQuizAnswer(2)}>
          {roundData.option2}
        </Button>
        <Button variant="contained" onClick={() => handleQuizAnswer(3)}>
          {roundData.option3}
        </Button>
        <Button variant="contained" onClick={() => handleQuizAnswer(4)}>
          {roundData.option4}
        </Button>
      </Box>
    )
  }

  const JoinLobbyComponent = (
    <Box>
      <Typography variant="h6">Game Component</Typography>
      <Box>
        <FormControl>
          <InputLabel>Username</InputLabel>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} />
        </FormControl>
        <FormControl>
          <InputLabel>Lobby Code</InputLabel>
          <Input value={lobbyCode} onChange={(event) => setLobbyCode(event.target.value)} />
        </FormControl>
        <Button variant="contained" onClick={handleConnectionInit}>
          Connect
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container>
      {socket === null && JoinLobbyComponent}
      {socket !== null && (
        <Box>
          <Typography variant="h2">Connected!</Typography>
          <Typography>Lobby Code: {lobbyCode}</Typography>
          <Typography>Username: {username}</Typography>

          <Button variant="contained" onClick={handleSocketDisconnect}>
            Disconnect
          </Button>
          {isQuiz &&
            <QuizComponent />
          }
          {isAnswer &&
            <AnswerComponent />
          }
          {isInstruction &&
            <InstructionComponent />
          }
          {isInit &&
            <InitComponent />
          }
          {!isAnswer && !isQuiz && !isInstruction && !isInit &&
            <CircularProgress />
          }
        </Box>
      )}
    </Container>
  );
};

export default GameComponent;
