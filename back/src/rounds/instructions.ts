import { Socket } from "socket.io"


const instructionState = {
    roundType: "instruction",
    playersAnswered: [],
    answer: 0
}

const instructionQuestions = [
    {
        type: "instruction",
        instruction: "Leon doesn't have enough pictures, last one to take a picture of him drinks.",
    },
    {
        type: "instruction",
        instruction: "Everyone go touch leon's sleepout.",
    },
]

export { instructionState, instructionQuestions }