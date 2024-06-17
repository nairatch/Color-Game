const actionBtns = document.querySelectorAll("button[data-mode]");
const boxes = document.querySelectorAll("div.box");
const displayColor = document.querySelector("#displayColor");
const displayScore = document.querySelector("#displayScore");

const config = {
  mode: "",
  count: 0,
  answer: -1,
  score: 0,
  modes: {
    easy: {
      count: 3,
      win: 15,
      lose: -10,
    },
    medium: {
      count: 6,
      win: 30,
      lose: -20,
    },
    hard: {
      count: 9,
      win: 60,
      lose: -40,
    },
  },
};

actionBtns.forEach((button) => {
  button.addEventListener("click", function () {
    const mode = this.getAttribute("data-mode");
    initGame(mode);
  });
});

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (config.answer === -1 || config.mode === "" || config.count === 0) {
      displayAlert("Choose game mode", "Info", "Choose from buttons");
      return;
    }
    if (index >= config.count) {
      displayAlert("Incorrect Box", "question", "Choose from colored boxes");
      return;
    }

    if (box.getAttribute(`data-clicked`)) {
      displayAlert("Wrong Box", "warning", "The box was already clicked, please choose another one!");
      return;
    }
    const hasWon = config.answer === index;

    let score = hasWon
      ? config.modes[config.mode].win
      : config.modes[config.mode].lose;

    config.score += score;

    if (config.score < 0) {
      config.score = 0;
    }

    displayScore.textContent = config.score;

    displayAlert(
      hasWon ? "Won" : "Lost",
      hasWon ? "Success" : "error",
      `You picked ${hasWon ? "Correct" : "Incorrect"} box`
    );

    if (hasWon) {
      initGame(config.mode);
      return;
    }

    box.setAttribute("data-clicked", true);
    box.style.backgroundColor = "transparent";
    box.style.cursor = "not-allowed";

    const clickedCounts = document.querySelectorAll (
      "div.box[data-clicked]"
    ).length;

    if(clickedCounts + 1 ===config.count) {
      displayAlert("Skip", "Info", "You picked wrong boxes, your turn was skipped!")
      initGame(config.mode);
        return;
    }
   
  });
});

function initGame(mode) {
  if (!isCorrectMode(mode)) {
    displayAlert("Incorrect game mode", "error", "Choose from buttons");
    return;
  }

  initStyles();

  const count = config.modes[mode].count;
  const randomAnswer = getRandomNumber(count);
  const randomColors = getRandomColors(count);

  for (const [index, box] of boxes.entries()) {
    if (index === count) {
      break;
    }
    box.style.backgroundColor = randomColors[index];
    box.style.cursor = "pointer";
  }

  config.mode = mode;
  config.answer = randomAnswer;
  config.count = count;
  displayColor.textContent = randomColors[randomAnswer];
}

function isCorrectMode(mode) {
  return Object.keys(config.modes).includes(mode);
}
function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

function getRandomNumber(max = 256) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  return `rgb(${getRandomNumber()}, ${getRandomNumber()}, ${getRandomNumber()})`;
}

function getRandomColors(count = 3) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(getRandomColor());
  }
  return array;
}
function initStyles() {
  boxes.forEach((box) => {
    box.style.backgroundColor = "transparent";
    box.style.cursor = "not-allowed";
    box.removeAttribute("data-clicked");
  });
}
