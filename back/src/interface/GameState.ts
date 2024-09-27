interface StateInterface {
    roundType: string;
    answerIndex?: number;
    questionIndex: number;
    playersAnswered: string[]

}

interface LobbyInterface {
    lobbyCode: string;
    nextRoundType: string;
    currentState: StateInterface,
    players: string[]
}

interface GameState {
    [lobbyCode: string]: LobbyInterface
}

export {StateInterface, LobbyInterface, GameState}