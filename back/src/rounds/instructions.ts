const instructionState = {
    roundType: "instruction",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//Drink if you are in the bottom 50% of the podium

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