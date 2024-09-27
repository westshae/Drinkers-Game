

interface GameState {
    [lobbyCode: string]: {
        lobbyCode: string;
        nextRoundType: string;
        currentState: {
            roundType: string;
            answerIndex?: number;
            questionIndex: number;
            playersAnswered: string[]
        },
        players: string[]
    }
}

export { GameState }