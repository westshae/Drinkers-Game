import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface Game {
    username: string;
    lobbyId: number;
}

interface GameProps {
    game: Game | null;
    setGame: Dispatch<SetStateAction<Game | null>>;
}

const GameContext = createContext<GameProps | undefined>(undefined);

const GameContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [game, setGame] = useState<Game | null>(null);

    return (
        <GameContext.Provider value={{ game, setGame }}>
            {children}
        </GameContext.Provider>
    );
};

export { GameContext, GameContextProvider };
