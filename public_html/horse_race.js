
//define horse elements
let horseBlue = document.getElementById("horse-blue-img");
let horsePink = document.getElementById("horse-pink-img");
let horseRed = document.getElementById("horse-red-img");
let horseYellow = document.getElementById("horse-yellow-img");


//return a random integer in range [min, max]; (inclusive of the max value)
function getRandomIntegerInRange(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min)
}

//these variables will contain each horse's total margin
let totalMarginBlue = 0;
let totalMarginPink = 0;
let totalMarginRed = 0;
let totalMarginYellow = 0;

//IMPORTANT: this is the manually set range from which each increment is picked each iteration
let minMove = 0.01;
let maxMove = 0.22;

let varInterval;

//keep track of the order in which the horses finish
let rankings = [];

//adjust each horse's margin on the DOM here
function moveHorse(horse, marginAmount) {
	if (horse=='Blue') {
		horseBlue.style.marginLeft = marginAmount + '%';
	}
	if (horse=='Pink') {
		horsePink.style.marginLeft = marginAmount + '%';
	}
	if (horse=='Red') {
		horseRed.style.marginLeft = marginAmount + '%';
	}
	if (horse=='Yellow') {
		horseYellow.style.marginLeft = marginAmount + '%';
	}
}

//stop the setInterval
function finishRace() {
	clearInterval(varInterval);
}

function incrementalMovement() {

	//determine the random increments for each horse here
	let nextMarginBlue = getRandomIntegerInRange(minMove, maxMove);
	let nextMarginPink = getRandomIntegerInRange(minMove, maxMove);
	let nextMarginRed = getRandomIntegerInRange(minMove, maxMove);
	let nextMarginYellow = getRandomIntegerInRange(minMove, maxMove);

	//add those random increments to each horse's running total of left margin
	let totalMarginBlue += nextMarginBlue;
	let totalMarginPink += nextMarginPink;
	let totalMarginRed += nextMarginRed;
	let totalMarginYellow += nextMarginYellow;

	//display rankings as the horses finish
	if (rankings.length==1) {
		displayRankings(rankings[0], "1st");
	}

	if (rankings.length==2) {
		displayRankings(rankings[1], "2nd");
	}

	if (rankings.length==3) {
		displayRankings(rankings[2], "3rd");
	}

	if (rankings.length==4) {
		displayRankings(rankings[3], "4th");

		let resultWinnings = calculateWinnings();
		displayResults(rankings[0], resultWinnings[0], resultWinnings[1]);
		finishRace();
	}

	//the next four statements handle each horse's arrival to the finish
	if (totalMarginBlue>=80){
		//always truncate down to a margin of 80 if we go over; this is the finish line
		totalMarginBlue=80;
		if (rankings.includes('blue')!=true) {
			rankings.push('blue');
		}
	}

	if (totalMarginPink>=80){
		totalMarginPink=80;
		if (rankings.includes('pink')!=true) {
			rankings.push('pink');
		}
	}
	if (totalMarginRed>=80){
		totalMarginRed=80;
		if (rankings.includes('red')!=true) {
			rankings.push('red');
		}
	}
	if (totalMarginYellow>=80){
		totalMarginYellow=80;
		if (rankings.includes('yellow')!=true) {
			rankings.push('yellow');
		}
	}

	//move the horses on the DOM based on computed margins
	moveHorse("Blue", totalMarginBlue);
	moveHorse("Pink", totalMarginPink);
	moveHorse("Red", totalMarginRed);
	moveHorse("Yellow", totalMarginYellow);
}

//the race starts once the button is clicked
function startRace() {
	if (alreadyClicked==false) {
		varInterval = setInterval(incrementalMovement, 9);
		alreadyClicked=true;
	}
}

//create a flag to check if the button was already clicked
let alreadyClicked;
alreadyClicked = false;

//define the button element and add functionality to it
let startRaceButton = document.getElementById("get-button");
startRaceButton.addEventListener("click", startRace);

//show race rankings by adding text and styling to placeholder span objects
function displayRankings(color, position) {
	let blueSpan = document.getElementById("blue-span");
	let pinkSpan = document.getElementById("pink-span");
	let redSpan = document.getElementById("red-span");
	let yellowSpan = document.getElementById("yellow-span");

	let dict = {"blue":blueSpan,
						 	"pink":pinkSpan,
							"red":redSpan,
							"yellow":yellowSpan
						}

	let element = dict[color];
	element.innerText = position + " Place!";
	element.style.fontWeight = 'bolder';

	if (position == "1st") {
		element.style.fontSize = "15pt";
	}
}

let playAgainButton;

//calculate winnings
function calculateWinnings() {
	let userBetSize = document.getElementById('betSizeInput').value;

	//since odds are 1/4; winners will recive 4x their bet
	let winAmount = userBetSize * 4;
	let loseAmount = userBetSize;

	return [winAmount, loseAmount]
}

//show a message for winners/losers after the race
//and add a button to play again
function displayResults(firstPlaceColor, winAmount, loseAmount) {

	let userChoice = document.getElementById("horse-select");
	let choicetext = userChoice.options[userChoice.selectedIndex].text;

	let bodyElement = document.querySelector("body");
	let resultsDiv = document.createElement('h2');
	let playAgain = document.createElement('button');
	playAgain.textContent = "Play Again";
	playAgain.style.fontSize = '12pt';
	playAgain.setAttribute('id','play-again');

	if (choicetext.toLowerCase()==firstPlaceColor) {
		resultsDiv.textContent = "Congrats! You won $" + winAmount;
	}
	else {
		resultsDiv.textContent = "Sorry! You lost $" + loseAmount;
	}
	resultsDiv.style.margin = "6px 0px";

	bodyElement.appendChild(resultsDiv);
	bodyElement.appendChild(playAgain);

	playAgainButton = document.getElementById("play-again");
	redirect();
}

function redirect() {
		playAgainButton.addEventListener("click", playAgain);
}

//reset the race by reloading the page
function playAgain() {
	window.location.reload();
}
