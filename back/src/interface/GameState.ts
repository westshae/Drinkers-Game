export default interface GameState {
    [lobbyCode: string]: {
        lobbyCode: string;
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