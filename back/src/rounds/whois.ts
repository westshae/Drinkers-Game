
const whoisState = {
    roundType: "whois",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

const whoisQuestions = [
    {
        type: "whois",
        question: "Are you holding your drink?",
        answerIndex: 1
    },
    {
        type: "whois",
        question: "Is your left hand empty?",
        answerIndex: 1
    },
]

export {whoisState, whoisQuestions}