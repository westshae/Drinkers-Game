
const dareState = {
    roundType: "dare",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//answerIndex 0 == dont drink

const dareQuestions = [
    {
        type: "dare",
        question: "Go hug Leon, or drink",
        answerIndex: 0
    },
    {
        type: "dare",
        question: "Go steal Leon's phone, or drink",
        answerIndex: 0
    },
    {
        type: "date",
        instruction: "Swap drinks with someone.",
        answerIndex: 0,
    },
    {
        type: "dare",
        instruction: "Shout out 'Leon ya sexy bastard'",
        answerIndex: 0,
    },
]

export {dareState, dareQuestions}