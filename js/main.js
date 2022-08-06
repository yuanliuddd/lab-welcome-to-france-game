class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.element = null;
    this.cells = this._createCells();
  }
  _createCells() {
    const cellsNum = this.height * this.width;
    let cellsArr = [];
    for (let i = 0; i < cellsNum; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cellsArr.push(cell);
      document.querySelector(".grid").appendChild(cell);
    }
    return cellsArr;
  }
}
const board = new GameBoard(10, 10);

function fisherYatesShuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[j];
    arr[j] = arr[i - 1];
    arr[i - 1] = temp;
  }
}

function getRandomSelection(n, array) {
  const cloned = Array.from(array);
  fisherYatesShuffle(cloned);
  const selected = cloned.slice(0, n);
  return selected;
}
const inventoryDivList = document.querySelector(".inventory");
let listClassName;

const inventory = {
  element: null,
  add() {
    collectibles.forEach((ele) => {
      const eleName = ele.className;
      if (player.cell.classList.contains(eleName)) {
        ele.collect();
        ele.hide();
        inventoryDivList.appendChild(this.element);
      }
    });
  },
  clear() {
    this.element = null;
  },
};

class Collectible {
  constructor(className) {
    this.className = className;
    this.cell = null;
    this.isCollected = false;
  }
  hide() {
    this.cell.classList.remove(this.className);
    this.cell = null;
  }
  collect() {
    const temp = document.createElement("div");
    temp.classList.add("item");
    temp.classList.add(`${this.className}`);
    inventory.element = temp;
  }
  display() {
    this.cell.classList.add(this.className);
  }
}

const collectibles = [
  "carte-vitale",
  "titre-de-sejour",
  "sim-card",
  "compte-bancaire",
  "apartment",
  "job",
].map((c) => new Collectible(c));

function distributeCollectibles() {
  const randomCells = getRandomSelection(collectibles.length, board.cells);
  randomCells.forEach((ele, i) => {
    collectibles[i].cell = ele;
    collectibles[i].display();
  });
}

function getRandomUnoccupiedCell() {
  const occupiedCells = collectibles.map((ele) => ele.cell);
  const unoccupiedCells = board.cells.filter((boardCell) => {
    return !occupiedCells.includes(boardCell);
  });
  return getRandomSelection(1, unoccupiedCells)[0];
}

const player = {
  className: "player",
  cell: getRandomUnoccupiedCell(),
  show() {
    this.cell.classList.add("player");
  },
  hide() {
    this.cell.classList.remove("player");
  },
  move(direction) {
    const directionObj = ["up", "right", "down", "left"];

    directionObj.forEach((key, keyIndex) => {
      if (key === direction) {
        this.cell.classList.remove("player");
        let numbers = keyIndex % 2 === 0 ? 10 : 1;
        let index = 0;

        if (keyIndex > 0 && keyIndex < 3) {
          if (
            keyIndex === 1 &&
            (this.cell.dataset.index[1] === "9" ||
              this.cell.dataset.index === "9")
          ) {
            index = +this.cell.dataset.index;
          } else {
            index = +this.cell.dataset.index + numbers;
          }
        } else {
          if (keyIndex === 3 && +this.cell.dataset.index % 10 === 0) {
            index = +this.cell.dataset.index;
          } else {
            index = +this.cell.dataset.index - numbers;
          }
        }

        if (index > 99 || index < 0) {
          index = +this.cell.dataset.index;
        }

        this.cell = board.cells.find((cell, i) => {
          return i === index ? cell : null;
        });
        this.show();
        this._detectCollisions();
        game.win();
      }
    });
  },
  canMove(direction) {},
  _detectCollisions() {
    listClassName = [...inventoryDivList.children].map((ele) =>
      ele.className.slice(5)
    );

    this.cell.classList.contains("sim-card") ? inventory.add() : null;
    this.cell.classList.contains("apartment") ? inventory.add() : null;

    if (listClassName.length < 1) {
      if (
        this.cell.classList.contains("sim-card") ||
        this.cell.classList.contains("apartment")
      ) {
        inventory.add();
      } else {
        this.cell.classList.contains("compte-bancaire")
          ? window.alert("You must collect sim-card first!")
          : null;
        this.cell.classList.contains("carte-vitale")
          ? window.alert("You must collect apartment, job first!")
          : null;
        this.cell.classList.contains("job")
          ? window.alert("You must collect titre-de-sejour first!")
          : null;
        this.cell.classList.contains("titre-de-sejour")
          ? window.alert("You must collect apartment first!")
          : null;
      }
    } else {
      if (this.cell.classList.contains("compte-bancaire")) {
        if (listClassName.includes("sim-card")) {
          inventory.add();
        } else {
          window.alert("You must collect sim-card first!");
        }
      } else if (this.cell.classList.contains("carte-vitale")) {
        if (
          listClassName.includes("job") &&
          listClassName.includes("apartment")
        ) {
          inventory.add();
        } else {
          window.alert("You must collect apartment, job first!");
        }
      } else if (this.cell.classList.contains("job")) {
        if (listClassName.includes("titre-de-sejour")) {
          inventory.add();
        } else {
          window.alert("You must collect titre-de-sejour first!");
        }
      } else if (this.cell.classList.contains("titre-de-sejour")) {
        if (listClassName.includes("apartment")) {
          inventory.add();
        } else {
          window.alert("You must collect apartment first!");
        }
      }
    }
  },
};

const game = {
  isStarted: false,
  isWon: false,
  isLost: false,
  // iteration 5
  winAudio: null,
  win() {
    if (listClassName.length === 6) {
      this.isStarted = false;
      inventory.clear();
      player.hide();
      window.alert('You won !')
    }
  },
  start() {
    [...inventoryDivList.children].forEach(ele=>ele.remove())
    this.isStarted = true;
    distributeCollectibles();
    player.show();
    // iteration 5
    // reset the music
  },
};

const startButton = document.querySelector("button#start");

startButton.addEventListener("click", () => {
  if (game.isStarted) {
    return;
  } else {
    game.start();
  }
});

document.addEventListener("keydown", (event) => {
  if (!game.isStarted) {
    return;
  }

  switch (event.code) {
    case "ArrowUp":
      player.move("up");
      break;
    case "ArrowDown":
      player.move("down");
      break;
    case "ArrowLeft":
      player.move("left");
      break;
    case "ArrowRight":
      player.move("right");
      break;
  }
});
