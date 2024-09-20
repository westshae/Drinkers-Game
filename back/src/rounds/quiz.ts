import { Socket } from "socket.io"

const quizState = {
    roundType: "quiz",
    playersAnswered: {},
    leaderboardDisplayed: false,
    answer: 1
}

const quizQuestions = [
    {
        type: "quiz",
        question: "What noise does a cow make?",
        option1: "Oink",
        option2: "Moo",
        option3: "Bark",
        option4: "Meow"
    },
    {
        type: "quiz",
        question: "How many eyes do you have?",
        option1: "2",
        option2: "5",
        option3: "8",
        option4: "1"
    },
]

export {quizState, quizQuestions}