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
  const [roundType, setRoundType] = useState<string | null>(null)

  const runAlertSound = async () => {
    const audio = new Audio('/button-11.mp3')
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
    await new Promise(resolve => setTimeout(resolve, 500));

    audio.play()
  }

  const handleConnectionInit = useCallback(() => {
    const backend_url = process.env.REACT_APP_BACKEND_URL;
    if(!backend_url) return
    const newSocket = io(backend_url, {
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

    newSocket.on('round', (data: any) => {
      const { type } = data;
      console.log(data)

      setRoundType(type)
      setRoundData(data)
      if(type !== "answer"){
        runAlertSound()
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
      socket.disconnect();
      setSocket(null);
      console.log("Socket disconnected");
    }
  };

  const handleAnswer = (option: number) => {
    if (socket === null) return
    const answer = {
      username: username,
      lobbyCode: lobbyCode,
      answer: option
    }
    socket.emit("answer", JSON.stringify(answer))
    setRoundType(null)
    setRoundData({})
  }

  const AnswerComponent = () => {
    const { correctAnswer, message } = roundData;

    return (
      <Box sx={{
        backgroundColor: correctAnswer ? greenCode : theme.palette.primary.dark,
        color: whiteCode,
        padding: 2,
        borderRadius: 1,
      }}
      >
        <Typography variant='h4'>{message}</Typography>
      </Box>
    )
  }
  const DareComponent = () => {
    const { question } = roundData;

    return (
      <Box>
        <Typography variant='h4'>{question}</Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "green", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(0)}>
              I did it!
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "red", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(1)}>
              I didn't do it...
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    )
  }
  const WhoisComponent = () => {
    const { question } = roundData;

    return (
      <Box>
        <Typography variant='h4'>{question}</Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "green", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(0)}>
              I am.
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "red", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(1)}>
              I am not.
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    )
  }
  const TruthComponent = () => {
    const { question } = roundData;

    return (
      <Box>
        <Typography variant='h4'>{question}</Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "green", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(0)}>
              Yes I have...
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "red", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(1)}>
              Nope, I haven't...
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    )
  }

  const PointComponent = () => {
    const { instruction } = roundData;

    return (
      <Box>
        <Box sx={{
          backgroundColor: redCode,
          color: whiteCode,
          padding: 2,
          borderRadius: 1,
        }}>
          <Typography variant='h5'>{instruction}</Typography>
        </Box>
        <br/>
        <Button style={{width: "100%"}} variant="contained" onClick={() => handleAnswer(0)}>
          Click once everyone has pointed.
        </Button>

      </Box>
    )
  }

  const InstructionComponent = () => {
    const { instruction } = roundData;

    return (
      <Box>
        <Box sx={{
          backgroundColor: redCode,
          color: whiteCode,
          padding: 2,
          borderRadius: 1,
        }}>
          <Typography variant='h5'>{instruction}</Typography>
        </Box>
        <br/>
        <Button style={{width: "100%"}} variant="contained" onClick={() => handleAnswer(0)}>
          Click on completion
        </Button>

      </Box>
    )
  }
  const QuizComponent = () => {
    const { question, option1, option2, option3, option4 } = roundData;

    return (
      <Box>
        <Typography variant='h4'>{question}</Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "red", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(1)}>
              {option1}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "blue", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(2)}>
              {option2}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "green", color: whiteCode, width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(3)}>
              {option3}
            </Button>
          </Grid2>
          <Grid2 xs={6}>
            <Button style={{ backgroundColor: "yellow", color: 'black', width: "100%", padding: "50%", fontSize: "1.5rem" }} variant="contained" onClick={() => handleAnswer(4)}>
              {option4}
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

  const renderComponent = () => {
    switch (roundType) {
      case "quiz":
        return <QuizComponent />;
      case "answer":
        return <AnswerComponent />;
      case "instruction":
        return <InstructionComponent />;
      case "point":
        return <PointComponent />;
      case "truth":
        return <TruthComponent />;
      case "whois":
        return <WhoisComponent />;
      case "dare":
        return <DareComponent />;
      default:
        return <LoadingComponent />;
    }
  };
  

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

          {renderComponent()}
        </Box>
      )}
    </Container>
  );
};

export default GameComponent;
