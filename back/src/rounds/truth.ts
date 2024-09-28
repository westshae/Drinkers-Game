
const truthState = {
    roundType: "truth",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//answerIndex !== answerIndex == drink

const truthQuestions = [
    {
        type: "truth",
        question: "Have you ever pissed on the side of the road?",
        answerIndex: 1
    },
    {
        type: "truth",
        question: "Have you forgotten anyone's name at the party?",
        answerIndex: 1
    },
]

export {truthState, truthQuestions}