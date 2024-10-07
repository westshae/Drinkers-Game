
const quizState = {
    roundType: "quiz",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//state.answerIndex !== question.answerIndex == drink

const quizQuestions = [
    {
        type: "quiz",
        question: "Which answer is the right answer?",
        option1: "This one",
        option2: "That one",
        option3: "This one but for real this time",
        option4: "Definitely not this one",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "Which of the following is a fish?",
        option1: "Dolphin",
        option2: "Seahorse",
        option3: "Starfish",
        option4: "Jellyfish",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "How many months have 28 days?",
        option1: "1",
        option2: "12",
        option3: "7",
        option4: "5",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "How many times can you subtract 10 from 100?",
        option1: "1",
        option2: "10",
        option3: "9",
        option4: "0",
        answerIndex: 1
    },
    {
        type: "quiz",
        question: "You take 4 apples from your bowl of 6. How many do you have?",
        option1: "6",
        option2: "2",
        option3: "4",
        option4: "0",
        answerIndex: 1
    },
    {
        type: "quiz",
        question: "Which of the following is a type of rock?",
        option1: "Coal",
        option2: "Salt",
        option3: "Ice",
        option4: "Sand",
        answerIndex: 3
    },
    {
        type: "quiz",
        question: "Who said 'You can go down on me furry-style, anytime'?",
        option1: "Leon",
        option2: "Izzy",
        option3: "David",
        option4: "Nix",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "Who said 'You have to think of it as a group interview' (Discussing orgies)?",
        option1: "Izzy",
        option2: "Jared",
        option3: "Leon",
        option4: "Shae",
        answerIndex: 3
    },
    {
        type: "quiz",
        question: "Who said 'If I was a horse, that would be hot'?",
        option1: "Leon",
        option2: "Shae",
        option3: "Jen",
        option4: "Izzy",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "Who said 'Concentration camps have their place'?",
        option1: "Leon",
        option2: "Shae",
        option3: "Jared",
        option4: "David",
        answerIndex: 1
    },
    {
        type: "quiz",
        question: "Who said 'It's a really untapped market, Dicks in children's rooms'?",
        option1: "David",
        option2: "Izzy",
        option3: "Joseph",
        option4: "Leon",
        answerIndex: 2
    },
    {
        type: "quiz",
        question: "Who said 'Those are good feet Izzy'?",
        option1: "Izzy",
        option2: "David",
        option3: "Jen",
        option4: "Jared",
        answerIndex: 4
    },
]

export {quizState, quizQuestions}