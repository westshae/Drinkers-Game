export default interface GameState {
    [lobbyCode: string]: {
        lobbyCode: string;
        nextRoundType: string;
        currentState: {
            roundType: string;
            answer: any;
            playersAnswered: {
                [username: string]: {
                    answer: any
                }
            }
        }
        players: {
            [username: string]: {
                score: number;
                leaderboardDisplayed: boolean;
            };
        };
    };
}