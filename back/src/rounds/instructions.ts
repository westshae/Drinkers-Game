import { StateInterface } from "../interface/GameState"

const instructionState:StateInterface = {
    roundType: "instruction",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

const instructionQuestions = [
    {
        type: "instruction",
        instruction: "Leon doesn't have enough pictures, last one to take a picture of him drinks.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Everyone go touch leon's sleepout.",
        answerIndex: 0,
    },
]

export { instructionState, instructionQuestions }