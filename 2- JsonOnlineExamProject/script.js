// Global variable to store data returned from the server for access by all functions
let serverData;

// Create a connection object to connect to the server
const connection = new XMLHttpRequest();

// When the connection object is ready to connect to the server, fetch and return data from the JSON file
connection.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        serverData = JSON.parse(connection.responseText);
        fetchQuestion();
    }
    return serverData;
};

// Provide necessary information for the server connection and send the data retrieval command to the server
connection.open("GET", "data.json", true);
connection.send();

// Define variables for easy access to all input and output elements in the user interface
const displayArea = document.getElementById("quiz");
const answerOptions = document.querySelectorAll(".option");
const currentQuestion = document.getElementById("question");

const optionADescription = document.getElementById("optionADescription");
const optionBDescription = document.getElementById("optionBDescription");
const optionCDescription = document.getElementById("optionCDescription");
const optionDDescription = document.getElementById("optionDDescription");

const submitButton = document.getElementById("submitQuiz");

// Reset score and question counter before starting the quiz
let score = 0;
let index = 0;

// Clear any selections if they exist and fill in the question and answer options for the next question
function fetchQuestion() {
    resetSelections();

    console.log(serverData);
    let nextQuestionContent = serverData.questions[index];

    currentQuestion.innerHTML = nextQuestionContent.question;
    optionADescription.innerText = nextQuestionContent.optionA;
    optionBDescription.innerText = nextQuestionContent.optionB;
    optionCDescription.innerText = nextQuestionContent.optionC;
    optionDDescription.innerText = nextQuestionContent.optionD;
}

function resetSelections() {
    answerOptions.forEach(option => option.checked = false);
}

// Retrieve and return the selected option based on the user's marked choice
function getSelection() {
    let selection;
    
    answerOptions.forEach(option => {
        if (option.checked) {
            selection = option.id;
        }
    });

    return selection;
    console.log(selection);
}

// Check the correctness of the answer when the button is clicked, update the score and question counter, and proceed to the next question
submitButton.addEventListener('click', () => {
    const selection = getSelection();
  
    if (selection) {
        if (selection === serverData.questions[index].correctAnswer) {
            score++;
        }

        index++;

        // Continue fetching the next question until the last question, then display the result
        if (index < serverData.questions.length) {
            fetchQuestion();
        } else {
            displayArea.innerHTML = `
                <h2>You scored ${score}/${serverData.questions.length} on the quiz.</h2>
                <button onclick="location.reload()">Restart</button>
            `;
        }
    }
});
