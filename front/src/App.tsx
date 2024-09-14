import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { Box, CssBaseline } from '@mui/material';
import Locations from './Pages/LobbyPage';
import LobbyPage from './Pages/LobbyPage';
import GamePage from './Pages/GamePage';


const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
