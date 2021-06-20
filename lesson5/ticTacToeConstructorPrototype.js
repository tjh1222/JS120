const readline = require('readline-sync');


function Score() {
  this.score = 0;
}

Score.prototype.getScore =  function () {
  return this.score;
};

Score.prototype.incrementScore = function () {
  this.score += 1;
};

Score.prototype.resetScore = function () {
  this.score = 0;
};


function Square(squareNum) {
  this.number = squareNum;
  this.available = true;
  this.mark = Square.UNUSED_SQUARE;
}

Square.UNUSED_SQUARE = " ";

Square.prototype.getAvailability = function () {
  return this.available;
};

Square.prototype.getMark = function () {
  return this.mark;
};

Square.prototype.getSquareNumber = function() {
  return this.number;
};


function Row(startingCol, count) {
  this.squares = this.createRow(startingCol, count);
}

Row.prototype.createRow = function(startNumber, count) {
  let squares = [];
  for (let idx = startNumber; idx < startNumber + count; idx += 1) {
    squares.push(new Square(idx));
  }
  return squares;
};


function Board(size) {
  this.NumOfRows = size;
  this.rows = this.createRows(this.NumOfRows);
}

Board.prototype.isSquareAvailable = function (sqNum) {
  let isAvailable = false;
  this.rows.forEach((row) => {
    row.squares.forEach((square) => {
      if (square.getSquareNumber() === sqNum && square.getAvailability()) {
        isAvailable = true;
      }
    });
  });
  return isAvailable;
};

Board.prototype.getAvailableSquareNumbers = function() {
  let squares = this.getAvailableSquares();
  return squares.map((square) => square.getSquareNumber());
};

Board.prototype.getAvailableSquares = function() {
  let availableSquares = [];

  this.rows.forEach((row) => {
    row.squares.forEach((square) => {
      if (square.getAvailability()) {
        availableSquares.push(square);
      }
    });
  });
  return availableSquares;
};

Board.prototype.createRows = function(dimension) {
  let rows = [];
  let counter = 1;
  for (let idx = 1; idx <= dimension; idx += 1) {
    rows.push(new Row(counter, dimension));
    counter += dimension;
  }
  return rows;
};


Board.prototype.help = function() {
  console.log("");
  console.log("     |     |");
  console.log(`  ${this.rows[0].squares[0].getSquareNumber()}  |  ${this.rows[0].squares[1].getSquareNumber()}  |  ${this.rows[0].squares[2].getSquareNumber()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.rows[1].squares[0].getSquareNumber()}  |  ${this.rows[1].squares[1].getSquareNumber()}  | ${this.rows[1].squares[2].getSquareNumber()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(` ${this.rows[2].squares[0].getSquareNumber()}   |  ${this.rows[2].squares[1].getSquareNumber()}  |  ${this.rows[2].squares[2].getSquareNumber()}`);
  console.log("     |     |");
  console.log("");

  console.log("Press enter to Continue.");
  readline.question();
};

Board.prototype.isFull = function() {
  let fullCount = 0;
  for (let idx = 0; idx < this.NumOfRows; idx += 1) {
    let currentRow = this.rows[idx];
    let isFull = currentRow.squares.every((square) => {
      return square.getMark() !== Square.UNUSED_SQUARE;
    });
    if (isFull) {
      fullCount += 1;
    }
  }
  return fullCount === this.NumOfRows;
};


Board.prototype.getVerticalRows = function() {
  let verticalRows = [];

  for (let idx = 0; idx < this.NumOfRows; idx += 1) {
    let row = [];
    for (let idy = 0; idy < this.NumOfRows; idy += 1) {
      row.push(this.rows[idy].squares[idx]);
    }
    verticalRows.push(row);
  }
  return verticalRows;
};

Board.prototype.getDiagonalRows = function() {
  let diagonalRows = [];
  let forwardDiagonal = [];
  let backwardDiagonal = [];

  let rowCounter = 0;
  for (let idx = this.NumOfRows - 1; idx >= 0; idx -= 1) {
    forwardDiagonal.push(this.rows[idx].squares[idx]);
    backwardDiagonal.push(this.rows[rowCounter].squares[idx]);
    rowCounter += 1;
  }

  diagonalRows.push(backwardDiagonal, forwardDiagonal);
  return diagonalRows;
};

Board.prototype.display = function() {
  console.log("");
  console.log("     |     |");
  console.log(`  ${this.rows[0].squares[0].getMark()}  |  ${this.rows[0].squares[1].getMark()}  |  ${this.rows[0].squares[2].getMark()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.rows[1].squares[0].getMark()}  |  ${this.rows[1].squares[1].getMark()}  | ${this.rows[1].squares[2].getMark()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(` ${this.rows[2].squares[0].getMark()}   |  ${this.rows[2].squares[1].getMark()}  |  ${this.rows[2].squares[2].getMark()}`);
  console.log("     |     |");
  console.log("");
};


function Player(marker = undefined) {
  this.marker = marker;
  this.score = new Score();
}

Player.prototype.resetMarker = function() {
  this.marker = undefined;
};

Player.prototype.getMarker = function() {
  return this.marker;
};

Player.prototype.setMarker = function(marker) {
  this.marker = marker;
};

Player.prototype.mark = function(squareNum, board) {
  board.rows.forEach((row) => {
    row.squares.forEach((square) => {
      if (square.number === squareNum) {
        square.available = false;
        square.mark = this.marker;
      }
    });
  });
};


function Human() {
  this.name = "Human";
}

Human.prototype = Object.create(new Player());
Human.prototype.constructor = Human;

Human.prototype.getName = function () {
  return this.name;
};

Human.prototype.chooseMove = function(board) {
  let move;
  while (true) {
    console.log(`Pick the number that corresponds with the square you want to mark. The available squares are: (${board.getAvailableSquareNumbers().join(", ")}) `);
    console.log("If you forgot how the squares on the board are numbered enter the number 'h' for help.");
    move = readline.question().toLowerCase();

    if (move === "h") {
      board.help();
      console.clear();
      board.display();
      continue;
    }

    move = Number(move);
    console.log(move);
    if (board.isSquareAvailable(move)) break;
    console.log("Invalid Selection. Choose an open square.");
  }
  return move;
};


function Computer() {
  this.name = "Computer";
}

Computer.prototype = Object.create(new Player());
Computer.prototype.constructor = Computer;

Computer.prototype.getName = function() {
  return this.name;
};

Computer.prototype.chooseMove = function(board) {
  let possibleMoves = board.getAvailableSquares();
  let randomIdx = Math.floor(Math.random() * (possibleMoves.length - 1));
  return possibleMoves[randomIdx].number;
};

function Round(playerList) {
  this.playerList = playerList;
  this.board = new Board(3);
  this.winner = "";
}

Round.prototype.winnableRows = function() {
  let winnableRows = [];
  this.board.getVerticalRows().forEach((row) => winnableRows.push(row));
  this.board.rows.forEach((row) => winnableRows.push(row.squares));
  this.board.getDiagonalRows().forEach((row) => winnableRows.push(row));
  return winnableRows;
};

Round.prototype.findPlayerByMark = function(mark) {
  let player;
  for (let idx = 0; idx < this.playerList.length; idx += 1) {
    let currentPlayer = this.playerList[idx];
    if (currentPlayer.getMarker() === mark) {
      player = currentPlayer;
    }
  }
  return player;
};

Round.prototype.getRoundWinner = function() {
  let possibleWins = this.winnableRows();
  let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
  let winningMark = winningRow[0][0].getMark();
  return this.findPlayerByMark(winningMark);
};

Round.prototype.isWinner = function() {
  let possibleWins = this.winnableRows();
  let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
  return winningRow.length > 0;
};

Round.prototype.playerSelections = function(board) {
  for (let idx = 0; idx < this.playerList.length; idx += 1) {
    let currentPlayer = this.playerList[idx];
    let move = currentPlayer.chooseMove(board);
    currentPlayer.mark(move, board);
    if (this.isWinner() || board.isFull()) break;
  }
};

Round.prototype.playRound = function(playerList) {
  while (!this.board.isFull()) {
    this.board.display();
    this.playerSelections(this.board, playerList);
    if (this.isWinner()) break;
  }
  if (this.isWinner()) {
    this.winner = this.getRoundWinner();
    this.winner.score.incrementScore();
  }
  this.board.display();
};

Round.prototype.isRowComplete = function(row) {
  let mark = row[0].mark;
  if (mark === " ") return false;

  for (let idx = 1; idx < this.board.NumOfRows; idx += 1) {
    let currentMark = row[idx].mark;
    if ((currentMark !== mark)) return false;
  }
  return true;
};

Round.prototype.displayResult = function() {
  console.log(`${(this.winner.getName() === "Computer") ? "The Computer" : "You"} won this round!`);
};

function Game() {
  this.playerList = [new Human(), new Computer()];
  this.gamesToWin = undefined;
  this.winner = undefined;
}

Game.prototype.resetMarkers = function() {
  this.playerList.forEach(player => {
    player.resetMarker();
  });
};

Game.prototype.resetScores = function() {
  this.playerList.forEach(player => {
    player.score.resetScore();
  });
};

Game.prototype.displayMatchWinner = function() {
  let winner = this.getWinner();
  console.log(`${(winner.name === "Computer") ? "The Computer" : "You"} won the match!`);
};

Game.prototype.getWinner = function() {
  let player;
  for (let idx = 0; idx < this.playerList.length; idx += 1) {
    let currentPlayer = this.playerList[idx];
    if (currentPlayer.score.getScore() === this.gamesToWin) {
      player = currentPlayer;
    }
  }
  return player;
};

Game.prototype.displayScore = function() {
  let [human, computer] = this.playerList;

  console.log("-------------------------");
  console.log(`Player: ${human.score.getScore()} | Computer: ${computer.score.getScore()}`);
  console.log("-------------------------");
};

Game.prototype.isMarkerUnique = function(marker) {
  for (let idx = 0; idx < this.playerList.length; idx += 1) {
    let player = this.playerList[idx];
    if (marker === player.getMarker()) return false;
  }
  return true;
};

Game.prototype.getMarker = function(player) {
  let answer;
  while (true) {
    console.log(`Choose a single and unique character that you would like ${player.name} to use for the game?(ex: "x", "o",)?`);
    answer = readline.question();
    if (answer && answer.length === 1 && this.isMarkerUnique(answer)) break;
    console.log("Invalid character. Make sure you provide a unique character!");
  }
  return answer;
};

Game.prototype.matchWon = function() {
  for (let idx = 0; idx < this.playerList.length; idx += 1) {
    let currentPlayer = this.playerList[idx];
    if (currentPlayer.score.score === this.gamesToWin) return true;
  }
  return false;
};

Game.prototype.playAgain = function() {
  let answer;
  while (true) {
    console.log("Would you like to play again? (y/n)");
    answer = readline.question().toLowerCase();
    if (["y", "n"].includes(answer)) break;
  }
  return answer === "y";
};

Game.prototype.continue = function() {
  console.log("press the enter key to continue");
  readline.question();
};

Game.prototype.play = function() {
  while (true) {
    this.initialSetup();
    while (true) {
      let round = new Round(this.playerList);
      round.playRound(this.playerList);
      round.displayResult();
      this.displayScore();
      if (this.matchWon()) break;

      this.continue();
      console.clear();
    }
    this.displayMatchWinner();
    if (!this.playAgain()) {
      console.log("Thank you for playing! Goodbye.");
      break;
    }
  }
};

Game.prototype.displayRules = function() {
  console.log(`The first player to win ${this.gamesToWin} rounds wins the match. To win a round you need to be the first to fill an entire row with your symbol. Vertical, Horizontal, and Diagonal Rows are all considered.`);
};

Game.prototype.initialSetup = function() {
  this.gamesToWin = this.getGamesToWin();
  this.displayRules();
  this.resetScores();
  this.resetMarkers();
  this.playerList.forEach((player) => {
    player.setMarker(this.getMarker(player));
  });
};

Game.prototype.getGamesToWin = function() {
  let answer;

  while (true) {
    console.log("What score do you want to play to in this match?");
    answer = readline.question();
    if (Number(answer) && answer > 0) break;

    console.log("Invalid score. Provide an integer greater than 0.");
  }
  return Number(answer);
};

let game = new Game();
game.play();
