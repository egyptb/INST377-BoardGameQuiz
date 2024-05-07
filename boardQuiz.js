     
     var games;

     // Function to fetch data from the Board Game API
     function fetchGameData() {
        var req = new XMLHttpRequest();
        req.open("GET", "https://boardgamegeek.com/xmlapi2/hot?type=boardgame", false);
        req.send(null);
        return req.responseText;
    }
    

    // Function to initialize the quiz
    function startQuiz() {
        // Fetch game data
        const responseData = fetchGameData();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseData, "text/xml");
        const gameItems = xmlDoc.getElementsByTagName("item");
        
        // Extract game names and publication years
        games = Array.from(gameItems).map(item => ({
            name: item.getElementsByTagName("name")[0].getAttribute("value"),
            yearPublished: item.getElementsByTagName("yearpublished")[0].getAttribute("value")
        }));

        // Shuffle the order of games
        shuffleArray(games);
        
        // Display first question
        displayQuestion(games);
    }

    // Function to display quiz question
    function displayQuestion(games) {
        // Shuffle the order of games for each new question
        shuffleArray(games);

        const questionText = document.getElementById("questions-text");
        const answerButtons = document.getElementById("answer-buttons");
        const currentQuestionIndex = parseInt(questionText.dataset.index || 0);
        const currentGame = games[currentQuestionIndex];

        // Update question text
        questionText.innerText = `Guess the year ${currentGame.name} was published:`;

        // Clear existing answer buttons
        answerButtons.innerHTML = '';

        // Create answer buttons for the current game's publication year, and +-1 from that year
        const answerOptions = [
            currentGame.yearPublished,
            parseInt(currentGame.yearPublished) - 1,
            parseInt(currentGame.yearPublished) + 1
        ];

        // Shuffle answer options to randomize button order
        shuffleArray(answerOptions);

        // Create button for each answer option
        answerOptions.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => checkAnswer(option, games));
            answerButtons.appendChild(button);
        });

        // Show next button
        document.getElementById('next-button').style.display = 'none';
    }

    // Function to check user answer
    function checkAnswer(userAnswer, games) {
        const questionText = document.getElementById("questions-text");
        const currentQuestionIndex = parseInt(questionText.dataset.index || 0);
        const correctAnswer = parseInt(games[currentQuestionIndex].yearPublished);

        // Display next button
        document.getElementById('next-button').style.display = 'block';

        // Check user's answer
        // Get the score element
        const scoreElement = document.getElementById("score");

        // Get the current score from the score element
        let score = parseInt(scoreElement.innerText.split(":")[1].trim());
    
        // Increment the score if the answer is correct
        if (userAnswer == correctAnswer) {
            score++; // Increment the score
        }
    
        // Update the score element with the new score
        scoreElement.innerText = "Score: " + score;
    }

    // Function to display next question
    function nextQuestion() {
        const questionText = document.getElementById("questions-text");
        const currentQuestionIndex = parseInt(questionText.dataset.index || 0) + 1;
        questionText.dataset.index = currentQuestionIndex;

        // Display next question or end of quiz
        if (currentQuestionIndex < games.length) {
            displayQuestion(games);
        } else {
            endQuiz();
        }
    }

    // Function to end the quiz and display results
    function endQuiz() {
        const questionText = document.getElementById("questions-text");
        questionText.innerText = `Quiz Completed!`;
        document.getElementById("answer-buttons").innerHTML = '';

        // Hide next button
        document.getElementById('next-button').style.display = 'none';
    }

    // Shuffle array utility function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Start the quiz when the page loads
    window.onload = startQuiz;