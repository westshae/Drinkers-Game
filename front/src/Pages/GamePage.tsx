import { Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../Components/GameContext';

const GamePage = () => {

    const navigate = useNavigate()

    const gameContext = useContext(GameContext);
    if (!gameContext) { throw new Error("GameContext must be used within a LocationContextProvider")}
    const { setGame, game } = gameContext

    const [showHelpPopup, setShowHelpPopup] = useState<Boolean>(false);

    useEffect(() => {
        console.log("useEffect");
    }, [])


    return (
        <Box>
            <p>Game</p>
        </Box>
    )
}

export default GamePage;
