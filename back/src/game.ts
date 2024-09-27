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
                currentState: {...quizState},
                players: []
            };
            return true
        }

        return false
    }

    addNewPlayersToLobby(lobbyCode: string, username: string) {
        if(!this.game[lobbyCode].players.includes(username)) {
            this.game[lobbyCode].players.push(username)
        }
    }

    removePlayerFromLobby(lobbyCode: string, username: string) {
        this.game[lobbyCode].players = [... this.game[lobbyCode].players.filter(player => player !== username) ]
    }

    removeLobbyIfZeroPlayers(lobbyCode: string) {
        if (Object.keys(this.game[lobbyCode].players).length === 0) {
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

        if (!(lobbyCode in this.game)) throw new Error("This lobby doesn't exist")

        if(!this.game[lobbyCode].players.includes(username)) throw new Error("This player isn't in this lobby?")
        
        if(this.game[lobbyCode].currentState.playersAnswered.includes(username)) throw new Error("Player already answered")

        this.game[lobbyCode].currentState.playersAnswered.push(username)

        let correctAnswer = false;

        switch(this.game[lobbyCode].currentState.roundType){
            case "instruction":
                const position = this.game[lobbyCode].currentState.playersAnswered.length
                const half =  Math.ceil(this.game[lobbyCode].players.length / 2);

                correctAnswer = position <= half
                break
            case "quiz":
                correctAnswer = answer === this.game[lobbyCode].currentState.answerIndex
                break

        }

        return {
            type: "answer",
            correct: correctAnswer
        }
    }

    getRoundEmitQuestion(lobbyCode: string) {
        const roundType = this.getRoundType(lobbyCode)
        const questionIndex = this.game[lobbyCode].currentState.questionIndex
        switch (roundType) {
            case "instruction":
                return { ...instructionQuestions[questionIndex]}
            case "quiz":
                return { ...quizQuestions[questionIndex]}
            default:
                throw new Error("roundType doesn't match")
        }
    }

    getRoundState(type: string) {
        let state;
        switch (type) {
            case "instruction":
                state = { ...instructionState }
                state.questionIndex = Math.floor(Math.random() * instructionQuestions.length);
                state.answerIndex = instructionQuestions[state.questionIndex].answerIndex

                return {... state}

            case "quiz":
                state = { ...quizState }
                state.questionIndex = Math.floor(Math.random() * quizQuestions.length);
                state.answerIndex = quizQuestions[state.questionIndex].answerIndex

                return {... state}
            default:
                throw new Error("roundType doesn't match")
        }
    }

    setNewRoundData(lobbyCode: string) {
        const state = this.getRoundState(this.game[lobbyCode].nextRoundType);


    }

    setNextRoundType(lobbyCode: string, type: string) {
        this.game[lobbyCode].nextRoundType = type;
    }

    debugGame() {
        console.log(JSON.stringify(this.game))
    }

    debugState(lobbyCode: string) {
        console.log(JSON.stringify(this.game[lobbyCode].currentState))
    }

    debugLobby(lobbyCode: string) {
        console.log(JSON.stringify(this.game[lobbyCode]))
    }

    debugPlayers(lobbyCode: string) {
        console.log(JSON.stringify(this.game[lobbyCode].players))
    }
}

export default Game;
