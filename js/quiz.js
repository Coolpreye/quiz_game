let correctAnswer,
    correctNumber = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
    incorrectNumber = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    eventListeners();
});

const eventListeners = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer);
    document.querySelector('#clear-storage').addEventListener('click', clearResults);
}

// load questions
const loadQuestion = () => {
    const url = 'https://opentdb.com/api.php?amount=1';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestions(result.results))
}

//displays the questions from the api
const displayQuestions = questions => {
    // create html  questions
    const questionHtml = document.createElement('div');
    questionHtml.classList.add('col-12');

    questions.forEach(question => {
        // read the correct answer
        correctAnswer = question.correct_answer;

        // inject the correct answer in the possible answers
        let possibleAnswers = question.incorrect_answers;
        possibleAnswers.splice(Math.floor(Math.random * 3), 0, correctAnswer);

        // add the html for the question
        questionHtml.innerHTML = `
                <div class="row justify-content-between heading">
                    <p class="category">Category: ${question.category}</p>
                    <div class="totals">
                        <span class="badge badge-success">${correctNumber}</span>
                        <span class="badge badge-danger">${incorrectNumber}</span>
                    </div>
                </div>
                <h2 class="text-center">${question.question}</p>
            `;

        // generate html for possible answers
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4');
        possibleAnswers.forEach(answer => {
            const answerHtml = document.createElement('li');
            answerHtml.classList.add('col-12', 'col-md-5');
            answerHtml.textContent = answer;
            // attach an event when the answer is clicked
            answerHtml.onclick = selectAnswer;
            answerDiv.appendChild(answerHtml);
        });

        questionHtml.appendChild(answerDiv);

        document.querySelector('#app').appendChild(questionHtml);

    })
}

// when the answer is selected
const selectAnswer = (e) => {
    // remove the previous active class for each answer

    if(document.querySelector('.active')) {
        const activeAnswer = document.querySelector('.active');
        activeAnswer.classList.remove('active');
    }

    e.target.classList.add('active');
}

// checks if the answer is correct and 1 answer is selected
const validateAnswer = () => {
    if(document.querySelector('.questions .active')) {
        // everything is fine, check if answer is correct and only 1 option was selected
        checkAnswer();
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-5');
        errorDiv.textContent = 'Please select 1 answer';
        // select question div to insert alert
        const questionsDiv = document.querySelector('.questions');
        questionsDiv.appendChild(errorDiv);

        setTimeout(() => {
            document.querySelector('.questions .alert').remove();
        }, 3000);
    }
}

// check if the selected answer is correct or not
const checkAnswer = () => {
    const userAnswer = document.querySelector('.questions .active');
    if(userAnswer.textContent === correctAnswer) {
        correctNumber++;
    } else {
        incorrectNumber++;
    }

    // save into local storage
    saveIntoStorage();

    // clear previous result
    const app = document.querySelector('#app');
    while(app.firstChild) {
        app.removeChild(app.firstChild);
    }

    // load application
    loadQuestion();
}

// saves into storage total of corrects and incorrects
const saveIntoStorage = () => {
    localStorage.setItem('quiz_game_correct', correctNumber);
    localStorage.setItem('quiz_game_incorrect', incorrectNumber);
}

//  clears result from the storage
const clearResults =() => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 500);
}