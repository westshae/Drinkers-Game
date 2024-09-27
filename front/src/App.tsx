import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { Box, CssBaseline } from '@mui/material';
import GamePage from './Pages/GamePage';


const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ '@media (min-width: 500px)': {maxWidth: "500px", margin: "auto", borderLeft: "1px solid red", borderRight: "1px solid red" }}}>
        <Router>
          <Routes>
            <Route path="/" element={<GamePage />} />
          </Routes>
        </Router>
      </Box >
    </ThemeProvider>
  );
}

export default App;
