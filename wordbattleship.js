const letters = document.querySelectorAll(".scoreboard-letter");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const hintOne = document.getElementById("hint-button-1");
const hintTwo = document.getElementById("hint-button-2");
const hintThree = document.getElementById("hint-button-3");

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

  // keydown to also capture backspace and enter
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
            input.classList.add("correct");
            // if previously guessed wrong
            if (input.classList.contains("wrong")) {
              input.classList.remove("wrong");
            }
          } else {
            input.classList.add("wrong");
          }
        }
      });
    }
  });

  // display hints on button click
  hintOne.addEventListener("click", function () {
    getHint(rowDict);
  });

  hintTwo.addEventListener("click", function () {
    getHint(rowDict);
  });

  hintThree.addEventListener("click", function () {
    getHint(rowDict);
  });

  // function to get a random whole number
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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

    for (let i = 0; i < wordArray.length; i++) {
      const randomRow = getRandomInt(8);
      const wordLength = wordArray[i].length; // count how long the word is

      let randomCol;
      do {
        randomCol = getRandomInt(10);
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

  function getHint(array) {
    const keys = Object.keys(array);

    let randomIndex;
    let randomKey;
    debugger;

    randomIndex = getRandomInt(array.length - 1);
    randomKey = keys[randomIndex];

    document.getElementById(randomKey).classList.add("hint");
    document.getElementById(randomKey).textContent = array[randomKey];
  }
}
