import { GameState } from "./interface/GameState";
import { quizQuestions, quizState } from "./rounds/quiz";
import { instructionQuestions, instructionState } from "./rounds/instructions";
import { pointQuestions, pointState } from "./rounds/point";
import { truthQuestions, truthState } from "./rounds/truth";
import { whoisQuestions, whoisState } from "./rounds/whois";
import { dareQuestions, dareState } from "./rounds/dare";

class Game {
    private game: GameState = {};

    addNewLobby(lobbyCode: string) {
        if (!(lobbyCode in this.game)) {
            this.game[lobbyCode] = {
                lobbyCode: lobbyCode,
                nextRoundType: "instruction",
                currentState: structuredClone(quizState),
                players: []
            };
        }
    }

    addNewPlayersToLobby(lobbyCode: string, username: string) {
        if (!this.game[lobbyCode].players.includes(username)) {
            this.game[lobbyCode].players.push(username)
        }
    }

    removePlayerFromLobby(lobbyCode: string, username: string) {
        this.game[lobbyCode].players = [... this.game[lobbyCode].players.filter((player: string) => player !== username)]
    }

    removeLobbyIfZeroPlayers(lobbyCode: string) {
        if (Object.keys(this.game[lobbyCode].players).length === 0) {
            delete this.game[lobbyCode]
        }
    }

    disconnectSafely(lobbyCode: string, username: string) {
        this.removePlayerFromLobby(lobbyCode, username)
        this.removeLobbyIfZeroPlayers(lobbyCode)
    }

    getRoundType(lobbyCode: string) {
        return this.game[lobbyCode].currentState.roundType || null;
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

        if (!this.game[lobbyCode].players.includes(username)) throw new Error("This player isn't in this lobby?")

        if (this.game[lobbyCode].currentState.playersAnswered.includes(username)) throw new Error("Player already answered")

        this.game[lobbyCode].currentState.playersAnswered.push(username)
        let answerResponse = {
            type: "answer",
            correctAnswer: false,
            message: ""
        }

        switch (this.game[lobbyCode].currentState.roundType) {
            case "instruction":
                const position = this.game[lobbyCode].currentState.playersAnswered.length
                const half = Math.ceil(this.game[lobbyCode].players.length / 2);

                answerResponse.correctAnswer = position <= half
                answerResponse.message = answerResponse.correctAnswer ? "No need to drink, you were in the first half that completed.":"A bit slow this time, drink up!";
                break
            case "quiz":
                answerResponse.correctAnswer = answer === this.game[lobbyCode].currentState.answerIndex
                answerResponse.message = answerResponse.correctAnswer ? "Ayy you got it right! No need to drink.":"You should've gotten the right answer, drink up!";
                break
            case "point":
                answerResponse.correctAnswer = true;
                answerResponse.message = "Only the people that were pointed at drink.";
                break;
            case "truth":
                if(answer === 0) {
                    answerResponse.correctAnswer = false;
                    answerResponse.message = "I'm shocked, drink up"
                } else if (answer === 1) {
                    answerResponse.correctAnswer = true;
                    answerResponse.message = "I guess you're not so terrible, you're safe this round."
                }
                break;
            case "whois": 
                if(answer === 0) {
                    answerResponse.correctAnswer = false
                    answerResponse.message = "Unlucky, drink up!"
                } else if (answer === 1) {
                    answerResponse.correctAnswer = true
                    answerResponse.message = "You've escaped the tasty alcoholic beverage."
                }
                break;
            case "dare":
                if(answer === 0){
                    answerResponse.correctAnswer = true
                    answerResponse.message = "Good job, no drink for you."
                } else if (answer === 1) {
                    answerResponse.correctAnswer = false
                    answerResponse.message = "Boringgggg, drink up."
                }
                break;
            
        }

        return answerResponse
    }

    getRoundEmitQuestion(lobbyCode: string) {
        const roundType = this.getRoundType(lobbyCode)
        const questionIndex = this.game[lobbyCode].currentState.questionIndex
        switch (roundType) {
            case "instruction": {
                const { answerIndex, ...remainder } = instructionQuestions[questionIndex];
                return structuredClone(remainder)
            }
            case "quiz": {
                const { answerIndex, ...remainder } = quizQuestions[questionIndex]
                return structuredClone(remainder)
            }
            case "point": {
                const { answerIndex, ...remainder } = pointQuestions[questionIndex]
                return structuredClone(remainder)
            }
            case "truth": {
                const { answerIndex, ...remainder } = truthQuestions[questionIndex];
                return structuredClone(remainder)
            }
            case "whois": {
                const { answerIndex, ...remainder } = whoisQuestions[questionIndex];
                return structuredClone(remainder)
            }
            case "dare": {
                const { answerIndex, ...remainder } = dareQuestions[questionIndex];
                return structuredClone(remainder)
            }
            default:
                throw new Error("roundType doesn't match")
        }
    }

    getRoundState(type: string) {
        switch (type) {
            case "instruction": {
                let state = structuredClone(instructionState)
                state.questionIndex = Math.floor(Math.random() * instructionQuestions.length);
                state.answerIndex = instructionQuestions[state.questionIndex].answerIndex

                return state
            }
            case "quiz": {
                let state = structuredClone(quizState)
                state.questionIndex = Math.floor(Math.random() * quizQuestions.length);
                state.answerIndex = quizQuestions[state.questionIndex].answerIndex

                return state
            }
            case "point": {
                let state = structuredClone(pointState)
                state.questionIndex = Math.floor(Math.random() * pointQuestions.length);
                state.answerIndex = pointQuestions[state.questionIndex].answerIndex

                return state
            }
            case "truth": {
                let state = structuredClone(truthState)
                state.questionIndex = Math.floor(Math.random() * truthQuestions.length);
                state.answerIndex = truthQuestions[state.questionIndex].answerIndex

                return state
            }
            case "whois": {
                let state = structuredClone(whoisState)
                state.questionIndex = Math.floor(Math.random() * whoisQuestions.length);
                state.answerIndex = whoisQuestions[state.questionIndex].answerIndex

                return state
            }
            case "dare": {
                let state = structuredClone(dareState)
                state.questionIndex = Math.floor(Math.random() * dareQuestions.length);
                state.answerIndex = dareQuestions[state.questionIndex].answerIndex

                return state
            }
            default:
                throw new Error("roundType doesn't match")
        }
    }

    setNewRoundData(lobbyCode: string) {
        const state = this.getRoundState(this.game[lobbyCode].nextRoundType);
        this.game[lobbyCode].currentState = state
    }

    setRandomNextRoundType(lobbyCode: string) {
        const options = ["point", "quiz", "instruction", "truth", "whois", "dare"]
        this.game[lobbyCode].nextRoundType = options[Math.floor(Math.random() * options.length)];
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
