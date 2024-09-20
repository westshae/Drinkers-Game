import GameState from "./interface/GameState";
import { quizQuestions, quizState } from "./rounds/quiz";
import { instructionQuestions, instructionState } from "./rounds/instructions";

class Game {
    private game: GameState = {};

    addNewLobby(lobbyCode: string) {
        if (!(lobbyCode in this.game)) {
            this.game[lobbyCode] = {
                lobbyCode: lobbyCode,
                nextRoundType: "instruction",
                currentState: quizState,
                players: {}
            };
        }
    }

    addNewPlayersToLobby(lobbyCode: string, username: string) {
        if (!(username in this.game[lobbyCode].players)) {
            this.game[lobbyCode].players[username] = {
                score: 0,
                leaderboardDisplayed: false
            };
        }
    }

    removePlayerFromLobby(lobbyCode: string, username: string) {
        if(username in this.game[lobbyCode].players){
            delete this.game[lobbyCode].players[username]
        }
    }

    removeLobbyIfZeroPlayers(lobbyCode: string) {
        if(Object.keys(this.game[lobbyCode].players).length === 0){
            delete this.game[lobbyCode]
        }
    }

    getRoundType(lobbyCode: string) {
        return this.game[lobbyCode].currentState.roundType;
    }

    getAllLobbyCodes() {
        return Object.keys(this.game);
    }

    haveAllPlayersAnswered(lobbyCode: string) {
        return Object.keys(this.game[lobbyCode].players).length === Object.keys(this.game[lobbyCode].currentState.playersAnswered).length;
    }

    acceptAnswer(message: string) {
        const parsed = JSON.parse(message);
        const { lobbyCode, username, answer } = parsed;
        if (lobbyCode in this.game && username in this.game[lobbyCode].players && !(username in this.game[lobbyCode].currentState.playersAnswered)) { // Username not in answers
            this.game[lobbyCode].currentState.playersAnswered[username] = {
                answer: answer,
            };
        }
    }

    scorePlayers(lobbyCode: string) {
        const answer = this.game[lobbyCode].currentState.answer;
        for (let username of Object.keys(this.game[lobbyCode].currentState.playersAnswered)) {
            const playerAnswer = this.game[lobbyCode].currentState.playersAnswered[username].answer;
            if (answer === playerAnswer) {
                this.game[lobbyCode].players[username].score += 1;
            }
        }
    }

    getRoundEmitQuestion(lobbyCode: string) {
        const roundType = this.getRoundType(lobbyCode)
        switch (roundType) {
            case "instruction":
                return instructionQuestions[0]
            case "quiz":
                return quizQuestions[0]
            default:
                throw new Error("roundType doesn't match")
        }
    }

    getRoundState(type: string) {
        switch (type) {
            case "instruction":
                return instructionState
            case "quiz":
                return quizState
            default:
                throw new Error("roundType doesn't match")
        }

    }

    getLeaderboard(lobbyCode: string) {
        const players = Object.entries(this.game[lobbyCode].players)
            .map(([username, { score }]) => ({ username, score,  }));

        // Sort the players by score in descending order
        players.sort((a, b) => b.score - a.score);

        return {
            type: "leaderboard",
            players: players
        }
    }

    hasPlayerSeenLeaderboard(lobbyCode: string, username: string) {
        const player = this.game[lobbyCode].players[username]
        if(player){
            return this.game[lobbyCode].players[username].leaderboardDisplayed 
        } else {
            return false;
        }
        
    }

    playerSawLeaderboard(lobbyCode: string, username: string) {
        const player = this.game[lobbyCode].players[username]
        if(player){
            return this.game[lobbyCode].players[username].leaderboardDisplayed = true
        }
    }

    setNewRoundData(lobbyCode: string) {
        const state = this.getRoundState(this.game[lobbyCode].nextRoundType);
        this.game[lobbyCode].currentState = state
    }

    setNextRoundType(lobbyCode: string, type: string) {
        this.game[lobbyCode].nextRoundType = type;
    }

    debugPrintGame() {
        console.log(JSON.stringify(this.game))
    }

    debugPrintLobby(lobbyCode: string){
        console.log(JSON.stringify(this.game[lobbyCode]))
    }
    
    debugPlayers(lobbyCode: string) {
        console.log(JSON.stringify(this.game[lobbyCode].players))
    }
    debugPlayer(lobbyCode: string, username: string) {
        console.log(JSON.stringify(this.game[lobbyCode].players[username]))
    }
}

export default Game;

//get/setCurrentRoundType
//get/setCurrentRoundAnswer
//getPlayersAnswered
//addPlayerAnswered
//addNewLobby
//addNewPlayersToLobby
//getPlayersInLobby
//getPlayerScore
