const pointState = {
    roundType: "point",
    playersAnswered: [],
    answerIndex: 0,
    questionIndex: 0
}

//Always returns don't drink as it's voted in person

const pointQuestions = [
    {
        type: "point",
        instruction: "Everyone point at the person most likely to bully Leon. Anyone with more 2 or more votes drinks.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who has the worst work-life balance. The person with the most votes drinks.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who's best dressed. The person with the most votes drinks.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who is the least drunk. The person with the most votes drinks.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who picked the easiest non-drinking challenge. We all pick a worse one for them.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who has the worst drink. The person with the most votes drinks.",
        answerIndex: 0,
    },
    {
        type: "point",
        instruction: "Everyone point at the person who has the best drink. The person with the most votes drinks.",
        answerIndex: 0,
    },
]

export { pointState, pointQuestions }