const letters = document.querySelectorAll(".scoreboard-letter");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const hintOne = document.getElementById("hint-button-1");
const hintTwo = document.getElementById("hint-button-2");
const hintThree = document.getElementById("hint-button-3");

// display hints on button click
hintOne.addEventListener("click", function () {
  document.getElementById("hint-text-1").classList.remove("hidden");
});

hintTwo.addEventListener("click", function () {
  document.getElementById("hint-text-2").classList.remove("hidden");
});

hintThree.addEventListener("click", function () {
  document.getElementById("hint-text-3").classList.remove("hidden");
});

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
  document.getElementById("hours").innerHTML = "00";
  document.getElementById("minutes").innerHTML = "00";
  document.getElementById("seconds").innerHTML = "00";
  document.getElementById("counts").innerHTML = "00";
});

// function to increment and update display on timer
function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hours").innerHTML = hrString;
    document.getElementById("minutes").innerHTML = minString;
    document.getElementById("seconds").innerHTML = secString;
    document.getElementById("counts").innerHTML = countString;

    setTimeout(stopWatch, 10);
  }
}

// function to start game
function startGame() {}
