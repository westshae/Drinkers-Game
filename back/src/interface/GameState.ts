export default interface GameState {
    [lobbyCode: string]: {
        lobbyCode: string;
        nextRoundType: string;
        currentState: {
            roundType: string;
            answer: any;
            playersAnswered: string[]
        }
        players: string[]
    };
}