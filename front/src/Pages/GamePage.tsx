import { Box, Typography, FormControl, Input, Button, Container, CircularProgress, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const whiteCode = "#f2f2f2"
const redCode = "#c0392b"
const greenCode = "green"

const GameComponent: React.FC = () => {
  const theme = useTheme();

  const [username, setUsername] = useState<string>('');
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const [roundData, setRoundData] = useState<any>({})
  const [isQuiz, setIsQuiz] = useState<boolean>(false)
  const [isAnswer, setIsAnswer] = useState<boolean>(false)
  const [isInstruction, setIsInstruction] = useState<boolean>(false)

  const runAlertSound = async () => {
    const audio = new Audio('/button-11.mp3')
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
  }

  const resetRoundTypeStates = () => {
    setIsAnswer(false)
    setIsQuiz(false)
    setIsInstruction(false)
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

    newSocket.on('round', (data: { type: string, question: string }) => {
      console.log(data)

      switch (data.type) {
        case "quiz":
          resetRoundTypeStates()
          setIsQuiz(true)
          setRoundData(data)
          runAlertSound()
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
          runAlertSound()
          break;
      }
    })

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
      console.log(socket.connected)
      socket.disconnect();
      console.log(socket.connected)
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
      <Box sx={{
        backgroundColor: roundData.correct ? greenCode : theme.palette.primary.dark,
        color: whiteCode,
        padding: 2,
        borderRadius: 1,
      }}
      >
        <Typography variant='h4'>{roundData.correct ? 'Just escaped drinking, lucky you.' : 'You failed! Drink up!'}</Typography>
      </Box>
    )
  }

  const InstructionComponent = () => {
    return (
      <Box>
        <Box sx={{
          backgroundColor: redCode,
          color: whiteCode,
          padding: 2,
          borderRadius: 1,
        }}>
          <Typography variant='h5'>{roundData.instruction}</Typography>
        </Box>
        <br/>
        <Button style={{width: "100%"}} variant="contained" onClick={() => handleInstructionAnswer()}>
          Click on completion
        </Button>

      </Box>
    )
  }
  const QuizComponent = () => {
    return (
      <Box>
        <Typography variant='h4'>{roundData.question}</Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "red", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleQuizAnswer(1)}>
              {roundData.option1}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "blue", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleQuizAnswer(2)}>
              {roundData.option2}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "green", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleQuizAnswer(3)}>
              {roundData.option3}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "yellow", color: 'black', width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleQuizAnswer(4)}>
              {roundData.option4}
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    )
  }

  const JoinLobbyComponent = (
    <Box>
      <Typography variant="h6">Welcome to Drinkers' Game by Shae</Typography>
      <Box>
        <FormControl style={{ margin: "1rem" }}>
          <Input placeholder={"Username..."} value={username} onChange={(event) => setUsername(event.target.value)} />
        </FormControl>
        <FormControl style={{ margin: "1rem" }}>
          <Input placeholder={"Lobby Code..."} value={lobbyCode} onChange={(event) => setLobbyCode(event.target.value)} />
        </FormControl>
        <Button style={{ margin: "1rem" }} variant="contained" onClick={handleConnectionInit}>
          Connect
        </Button>
      </Box>
      <Box>
        <Typography variant="h4">How to play</Typography>
        <Typography variant="h6">1. Insert your username (Must be unique)</Typography>
        <Typography variant="h6">2. If you're creating the lobby, insert a unique lobby code and click connect.</Typography>
        <Typography variant="h6">3. If you're joining a lobby, ask the host for the code, it'll be on their screen.</Typography>
        <Typography variant="h6">4. When you're in, every 5-10 minutes your phone will receive a notification.</Typography>
        <Typography variant="h6">5. Quickly check your phone, then complete the challenge. Once completed, you'll be told if you won, or lost.</Typography>
        <Typography variant="h6">6. If you won (Answered the question right, or Completed a challenge first), you'll be told you are safe.</Typography>
        <Typography variant="h6">7. If you lost, you'll be told to drink. (Note, you're more than welcome to use another challenge if you don't drink. Do a pushup, or do something embarassing)</Typography>

      </Box>
    </Box>
  );

  const LoadingComponent = () => {
    return (
      <Box>
        <Typography variant='h5'>Wait till the next round of questions</Typography>
        <CircularProgress />

      </Box>
    )
  }

  return (
    <Container>
      {socket === null && JoinLobbyComponent}
      {socket !== null && (
        <Box>
          <Box style={{ margin: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            <Typography>Lobby Code: {lobbyCode}</Typography>
            <Typography>Username: {username}</Typography>
            <Button variant="contained" onClick={handleSocketDisconnect}>I quit</Button>
          </Box>

          {isQuiz &&
            <QuizComponent />
          }
          {isAnswer &&
            <AnswerComponent />
          }
          {isInstruction &&
            <InstructionComponent />
          }
          {!isAnswer && !isQuiz && !isInstruction &&
           <LoadingComponent />
          }
        </Box>
      )}
    </Container>
  );
};

export default GameComponent;
