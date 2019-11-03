var secondsLeft = 75;
var timerInterval;

var timeEl = document.querySelector(".Time");
var questionsEl = document.querySelector(".questions-rendered");
var scoreEl = document.querySelector(".Score");
var highScoreEl = document.querySelector(".highScore");
var submitButton = document.querySelector("#submit");
var refreshButton = document.querySelector("#goBack");

var initialInput = document.querySelector("#initials");
var scoreList = document.querySelector("#scoreList");
var scoreForm = document.querySelector("#score-form");

var userInitials = [];

document.querySelector(".Score").style.display="none";
document.querySelector(".highscorePage").style.display="none";

refreshButton.addEventListener("click", function(){
    location.reload();
});

function setTime(){
    timerInterval = setInterval(function(){
        secondsLeft--;
        timeEl.textContent = "TIME REMAINING: " + secondsLeft;
        if(secondsLeft === 0){
            clearInterval(timerInterval);
            document.querySelector(".Score").style.display="block";
            document.querySelector(".Time").style.display="none";
            document.querySelector(".questions-rendered").style.display="none";
            highScoreEl.textContent = "YOUR SCORE IS " + secondsLeft;
        }
    }, 1000);
}

const startBtn = document.getElementById("startquiz");

startBtn.addEventListener("click", function() {
    setTime();
    startBtn.style.display = "none";
    document.querySelector(".splashPage").style.display="none";
    displayQuestions(questionIndex);
});

var questionIndex = 0;

function displayQuestions(){
    
    questionsEl.textContent = "";
    var question = questions[questionIndex];
    var questionDiv = document.createElement("div");
    var questionText = document.createElement("h2");
    questionText.textContent = question.title;
    questionDiv.appendChild(questionText);
    
    for (var i=0; i < question.choices.length ;i++) {
        var option = document.createElement("button");
        option.textContent = question.choices[i];
        option.setAttribute("class", "option");
        option.addEventListener("click", function(pick) {
            var optionClicked = (pick.target.innerHTML);
            
            if(optionClicked === questions[questionIndex].answer){
                alert("Correct!");
                displayQuestions(questionIndex++);
            }
            else{
                alert("Incorrect!");
                displayQuestions(questionIndex++);
                secondsLeft -= 15;
            }
            
        });
         if (questionIndex == questions.length - 1) { // Can't get it to  go to the last questions.
            clearInterval(timerInterval);
            document.querySelector(".Score").style.display="block";
            document.querySelector(".Time").style.display="none";
            highScoreEl.textContent = "YOUR SCORE IS " + secondsLeft;
            return;
        }
        questionDiv.appendChild(option);
    }
    questionsEl.appendChild(questionDiv);
}

function renderScores(){
    scoreList.innerHTML = "";
    
    for (var x = 0; x < userInitials.length; x ++){
        var letters = userInitials[x];
        
        var li = document.createElement("li");
        li.textContent = letters;
        li.setAttribute("data-index", x);
        
        var button = document.createElement("button");
        button.textContent = "Clear";
        
        li.appendChild(button);
        scoreList.appendChild(li);
    }
} 

function init() {
    var storedScores = JSON.parse(localStorage.getItem("userInitials"));
    
    if(storedScores !==null) {
        userInitials = storedScores;
    }
    
    const submitBtn = document.getElementById("submit");
    
    submitBtn.addEventListener("click", function() {
        event.preventDefault();
        
        var initialText = initialInput.value.trim();
        
        if (initialText === ""){
            return;
        }
        userInitials.push(initialText + " " + secondsLeft);
        console.log(userInitials);
        initialInput.value = "";
        
        document.querySelector(".Score").style.display="none";
        document.querySelector(".highscorePage").style.display='block';
        
        storeScore();
        renderScores();
        
    });
}

function storeScore(){
    localStorage.setItem("userInitials", JSON.stringify(userInitials));
}

scoreList.addEventListener("click", function(event){
    var element = event.target;
    
    if (element.matches("button")=== true){
        var index = element.parentElement.getAttribute("data-index");
        userInitials.splice(index, 1);
        
        storeScore();
        renderScores();
    }
});
init();