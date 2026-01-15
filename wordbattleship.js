const letters = document.querySelectorAll(".scoreboard-letter");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const hintOne = document.getElementById("hint-button-1");
const hintTwo = document.getElementById("hint-button-2");
const hintThree = document.getElementById("hint-button-3");
const hintFour = document.getElementById("hint-button-4");
const hintFive = document.getElementById("hint-button-5");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
const hintTitle = document.querySelector(".hint-header");
const hintSection = document.querySelector(".hint-container");
const scoreElement = document.querySelector(".digit");

// initialise hour, minute, second, count and timer variables
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer = false;

// event listener for when player clicks the play button
startButton.addEventListener("click", function () {
  timer = true;
  stopWatch();
  startGame();
  scoreElement.textContent = "100"; // initialise score to 100
});

// event listener for when player clicks the stop button
stopButton.addEventListener("click", function () {
  timer = false;
});

// event listener for when player clicks the reset button
resetButton.addEventListener("click", function () {
  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  document.getElementById("hours").textContent = "00";
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("counts").textContent = "00";
  document.getElementById("scoreboard").reset();
  letters.forEach((input) => {
    input.classList.remove("wrong");
    input.classList.remove("correct");
    input.classList.remove("hint");
  });
  document.getElementById("hint-text-1").classList.add("hidden");
  document.getElementById("hint-text-2").classList.add("hidden");
  document.getElementById("hint-text-3").classList.add("hidden");
  document.getElementById("hint-text-4").classList.add("hidden");
  document.getElementById("hint-text-5").classList.add("hidden");
  scoreElement.textContent = "0";
});

// function to increment and update display on timer
function stopWatch() {
  if (timer) {
    count++;

    // when more than 100 milliseconds, increment second
    if (count == 100) {
      second++;
      count = 0;
    }

    // when more than 60 seconds, increment minute
    if (second == 60) {
      minute++;
      second = 0;
    }

    // when more then 60 minutes, increment hour
    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    // create strings for display
    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    // append to hour for digits below 10
    if (hour < 10) {
      hrString = "0" + hrString;
    }

    // append to minute for digits below 10
    if (minute < 10) {
      minString = "0" + minString;
    }

    // append to second for digits below 10
    if (second < 10) {
      secString = "0" + secString;
    }

    // append to count for digits below 10
    if (count < 10) {
      countString = "0" + countString;
    }

    // update displayed values
    document.getElementById("hours").textContent = hrString;
    document.getElementById("minutes").textContent = minString;
    document.getElementById("seconds").textContent = secString;
    document.getElementById("counts").textContent = countString;

    // call itself after 10 milliseconds
    setTimeout(stopWatch, 10);
  }
}

// function to start game
async function startGame() {
  let done = false;

  const response = await fetch(
    "https://random-word-api.vercel.app/api?words=5&type=uppercase"
  );
  const responseObject = await response.json();

  const wordArray = [];

  // need to loop through the 5 objects and store in array
  for (let response of responseObject) {
    const wordParts = response.split(""); // separate each character into an array element
    wordArray.push(wordParts);
  }

  console.log("word array", wordArray);

  // dictionary of where each letter and position is
  const rowDict = mapPositions(wordArray);
  console.log(rowDict);

  // adjust difficulty of game
  let difficulty = "easy";

  easyButton.addEventListener("click", () => {
    difficulty = "easy";
    applyEasyMode(rowDict);
  });

  mediumButton.addEventListener("click", () => {
    difficulty = "medium";
    applyMediumMode(rowDict);
  });

  hardButton.addEventListener("click", () => {
    difficulty = "hard";
    applyHardMode();
  });

  // keydown to capture user pressing enter and backspace
  document.addEventListener("keydown", function handleKeyPress(event) {
    // named function to help with debugging by providing a meaningful name in stack traces instead of showing an anonymous function

    if (done) {
      // do nothing
      return;
    }

    const action = event.key; // get the keys

    if (action === "Enter") {
      // check which scoreboard-letters have inputs
      letters.forEach((input) => {
        if (input.value !== "") {
          console.log(input.id, input.value);
          if (
            input.id in rowDict &&
            input.value.toUpperCase() === rowDict[input.id]
          ) {
            // if previously guessed wrong
            if (input.classList.contains("wrong")) {
              input.classList.remove("wrong");
            }
            // if easy mode and hint color has been applied
            if (input.classList.contains("hint")) {
              input.classList.remove("hint");
            }
            input.classList.add("correct");
          } else {
            let currentScore = parseInt(scoreElement.textContent);
            let newScore = currentScore - 1;
            scoreElement.textContent = newScore.toString();
            input.classList.add("wrong");
          }
        }
      });
      if (checkWinCondition(rowDict)) {
        let currentScore = parseInt(scoreElement.textContent);
        alert("You win! Your score was " + currentScore);
        timer = false;
      }
    }

    if (action === "Backspace") {
      const active = document.activeElement;
      // ids are all letter-alphanum so split at the "-"
      const split = active.id.split("-");
      // get the alpha
      const alpha = split[1].at(0);
      // get the num
      const number = split[1].at(1);
      if (active.value === "" && number > 0) {
        // decrement the num to go to previous scoreboard-letter
        const backNum = number - 1;
        document.getElementById(`letter-${alpha}${backNum}`).focus();
      }
    }
  });

  // display hints on button click
  hintOne.addEventListener("click", function () {
    getHint(wordArray, 1);
    updateScore();
  });

  hintTwo.addEventListener("click", function () {
    getHint(wordArray, 2);
    updateScore();
  });

  hintThree.addEventListener("click", function () {
    getHint(wordArray, 3);
    updateScore();
  });

  hintFour.addEventListener("click", function () {
    getHint(wordArray, 4);
    updateScore();
  });

  hintFive.addEventListener("click", function () {
    getHint(wordArray, 5);
    updateScore();
  });
}

// function for easy mode - tells you where the words are and what the words are
function applyEasyMode(rowDict) {
  for (const [key, _] of Object.entries(rowDict)) {
    document.getElementById(key).classList.add("hint");
  }
  hintTitle.style.display = "block";
  hintSection.style.display = "block";
}

// function for medium mode - tells you what the words are
function applyMediumMode(rowDict) {
  for (const [key, _] of Object.entries(rowDict)) {
    document.getElementById(key).classList.remove("hint");
  }
  hintTitle.style.display = "block";
  hintSection.style.display = "block";
}

// function for hard mode - no hints
function applyHardMode() {
  hintTitle.style.display = "none";
  hintSection.style.display = "none";
}

// function for updating score based on hints provided
function updateScore() {
  let currentScore = parseInt(scoreElement.textContent);
  let newScore = currentScore - 10;
  scoreElement.textContent = newScore.toString();
}

// function to get an array of numbers rather than previous random number
function getNumArray(max) {
  numArray = Array.from(Array(max).keys());

  // shuffle
  let currentIndex = numArray.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [numArray[currentIndex], numArray[randomIndex]] = [
      numArray[randomIndex],
      numArray[currentIndex],
    ];
  }
  return numArray;
}

// function to map words to positions on grid
function mapPositions(wordArray) {
  const rowLength = 10;

  const rowDict = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
  };

  const wordDict = {};
  const rowArray = getNumArray(8);

  for (let i = 0; i < wordArray.length; i++) {
    let randomRow = rowArray.pop(); // use pop to prevent same row being used to avoid collisions
    const wordLength = wordArray[i].length; // count how long the word is

    let randomCol;
    do {
      const colArray = getNumArray(10);
      randomCol = colArray.pop();
    } while (rowLength - randomCol < wordLength);
    // rerun until there is enough space to put the word at the starting column position

    // look up row in dictionary
    const rowAlphabet = rowDict[randomRow];

    // iterate through the word and store the coordinates of each letter
    for (let j = 0; j < wordLength; j++) {
      const coordinate = ["letter-", rowAlphabet, randomCol + j];
      const idToLookup = coordinate.join("");
      wordDict[idToLookup] = wordArray[i][j];
    }
  }
  return wordDict;
}

// function to get a hint
function getHint(array, hintNum) {
  const hint = array[hintNum - 1];
  const hintWord = hint.join("");
  document.getElementById(`hint-text-${hintNum}`).classList.remove("hidden");
  document.getElementById(`hint-text-${hintNum}`).textContent = hintWord;
}

// function to check win condition
function checkWinCondition(rowDict) {
  for (const [key, _] of Object.entries(rowDict)) {
    if (!document.getElementById(key).classList.contains("correct")) {
      return false;
    }
  }
  return true;
}
