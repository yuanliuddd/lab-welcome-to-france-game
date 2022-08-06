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

const inventory = {
  element: null,
  add() {
    // iteration 3
  },
  clear() {
    // iteration 3 (reset behavior)
  },
};

class Collectible {
  constructor(className) {
    this.className = className;
    this.cell = null;
    this.isCollected = false;
  }
  hide() {
    // reset behavior
  }
  collect() {
    // iteration 4
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
    console.log(this.cell);
    this.cell.classList.add("player");
  },
  hide() {
    // iteration 3
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
            (this.cell.dataset.index[1] === "9" || this.cell.dataset.index ==='9')
          ) {
            index = +this.cell.dataset.index;
          } else {
            index = +this.cell.dataset.index + numbers;
          }
        } else {
          if (keyIndex === 3 && +this.cell.dataset.index % 10 ===0 ) {
            index = +this.cell.dataset.index;
          } else {
            index = +this.cell.dataset.index - numbers;
          }
        }

        if (index > 99 || index < 0) {
          index = +this.cell.dataset.index;
        }
        // else if (index % 10 === 0 || index % 9 === 0)

        this.cell = board.cells.find((cell, i) => {
          return i === index ? cell : null;
        });
        this.show();
      }
    });
  },
  canMove(direction) {},
  _detectCollisions() {
    // iteration 4
    // how do we detect collisions with items
    // when do we call this?
  },
};

const game = {
  isStarted: false,
  isWon: false,
  isLost: false,
  // iteration 5
  winAudio: null,
  win() {
    // iteration 4
    this.isStarted = false;
  },
  start() {
    this.isStarted = true;
    distributeCollectibles();
    player.show();
    // iteration 4
    // reset the inventory
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
