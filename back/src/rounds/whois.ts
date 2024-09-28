
const whoisState = {
    roundType: "whois",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//answerIndex 0 === drink up

const whoisQuestions = [
    {
        type: "whois",
        question: "Are you holding your drink?",
        answerIndex: 0
    },
    {
        type: "whois",
        question: "Are you drinking something with more than 10% alcohol?",
        answerIndex: 0
    },
]

export {whoisState, whoisQuestions}