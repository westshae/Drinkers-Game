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
    {
        type: "instruction",
        instruction: "Everyone hop on one leg 10 times.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Make an animal impression.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Pick something that isn't a hat, and make it your hat.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Raise your drink over your head.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Go do literally anything to annoy Leon.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Shout out (loudly) a compliment for Leon.",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Everyone sing happy birthday to Leon",
        answerIndex: 0,
    },
    {
        type: "instruction",
        instruction: "Go topup your drink.",
        answerIndex: 0,
    },
]

export { instructionState, instructionQuestions }