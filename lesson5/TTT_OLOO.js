const readline = require('readline-sync');

let Score =  {
  init() {
    this.score = 0;
    return this;
  },

  getScore() {
    return this.score;
  },

  incrementScore() {
    this.score += 1;
  },

  resetScore() {
    this.score = 0;
  }
};

let Square = {
  UNUSED_SQUARE: " ",

  init(squareNum) {
    this.number = squareNum;
    this.available = true;
    this.mark = Square.UNUSED_SQUARE;
    return this;
  },

  getAvailability() {
    return this.available;
  },

  getMark() {
    return this.mark;
  },

  getSquareNumber() {
    return this.number;
  }

};

let Row =  {

  init(startingCol, count) {
    this.squares = this.createRow(startingCol, count);
    return this;
  },

  createRow(startNumber, count) {
    let squares = [];
    for (let idx = startNumber; idx < startNumber + count; idx += 1) {
      //squares.push(new Square(idx));
      squares.push(Object.create(Square).init(idx));
    }
    return squares;
  }

};

let Board = {

  init(size) {
    this.NumOfRows = size;
    this.rows = this.createRows(this.NumOfRows);
    return this;
  },

  isSquareAvailable(sqNum) {
    let isAvailable = false;
    this.rows.forEach((row) => {
      row.squares.forEach((square) => {
        if (square.getSquareNumber() === sqNum && square.getAvailability()) {
          isAvailable = true;
        }
      });
    });
    return isAvailable;
  },

  getAvailableSquareNumbers() {
    let squares = this.getAvailableSquares();
    return squares.map((square) => square.getSquareNumber());
  },

  getAvailableSquares() {
    let availableSquares = [];

    this.rows.forEach((row) => {
      row.squares.forEach((square) => {
        if (square.getAvailability()) {
          availableSquares.push(square);
        }
      });
    });
    return availableSquares;
  },

  createRows(dimension) {
    let rows = [];
    let counter = 1;
    for (let idx = 1; idx <= dimension; idx += 1) {
      rows.push(Object.create(Row).init(counter, dimension));
      //      rows.push(new Row(counter, dimension));
      counter += dimension;
    }
    return rows;
  },

  help() {
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
  },

  isFull() {
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
  },


  getVerticalRows() {
    let verticalRows = [];

    for (let idx = 0; idx < this.NumOfRows; idx += 1) {
      let row = [];
      for (let idy = 0; idy < this.NumOfRows; idy += 1) {
        row.push(this.rows[idy].squares[idx]);
      }
      verticalRows.push(row);
    }
    return verticalRows;
  },

  getDiagonalRows() {
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
  },

  display() {
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
  }
};


let Player = {

  initialize(marker = undefined) {
    this.marker = marker;
    this.score = Object.create(Score).init();
    return this;
  },

  resetMarker() {
    this.marker = undefined;
  },

  getMarker() {
    return this.marker;
  },

  setMarker(marker) {
    this.marker = marker;
  },

  mark(squareNum, board) {
    board.rows.forEach((row) => {
      row.squares.forEach((square) => {
        if (square.number === squareNum) {
          square.available = false;
          square.mark = this.marker;
        }
      });
    });
  }
};

let Human = Object.create(Player);

Human.init = function(marker) {
  return this.initialize(marker);
};

Human.name = "Human";

Human.getName = function() {
  return this.name;
};

Human.chooseMove = function(board) {
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


let Computer = Object.create(Player);

Computer.init = function(marker) {
  return this.initialize(marker);
};

Computer.name = "Compute`r";

Computer.getName = function() {
  return this.name;
};

Computer.chooseMove = function(board) {
  let possibleMoves = board.getAvailableSquares();
  let randomIdx = Math.floor(Math.random() * (possibleMoves.length - 1));
  return possibleMoves[randomIdx].number;
};


let Round = {
  init(playerList) {
    this.playerList = playerList;
    this.board = Object.create(Board).init(3);
    this.winner = "";
    return this;

  },

  winnableRows() {
    let winnableRows = [];
    this.board.getVerticalRows().forEach((row) => winnableRows.push(row));
    this.board.rows.forEach((row) => winnableRows.push(row.squares));
    this.board.getDiagonalRows().forEach((row) => winnableRows.push(row));
    return winnableRows;
  },

  findPlayerByMark(mark) {
    let player;
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.getMarker() === mark) {
        player = currentPlayer;
      }
    }
    return player;
  },

  getRoundWinner() {
    let possibleWins = this.winnableRows();
    let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
    let winningMark = winningRow[0][0].getMark();
    return this.findPlayerByMark(winningMark);
  },

  isWinner() {
    let possibleWins = this.winnableRows();
    let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
    return winningRow.length > 0;
  },

  playerSelections(board) {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      let move = currentPlayer.chooseMove(board);
      currentPlayer.mark(move, board);
      if (this.isWinner() || board.isFull()) break;
    }
  },

  playRound(playerList) {
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

  },

  isRowComplete(row) {
    let mark = row[0].mark;
    if (mark === " ") return false;

    for (let idx = 1; idx < this.board.NumOfRows; idx += 1) {
      let currentMark = row[idx].mark;
      if ((currentMark !== mark)) return false;
    }
    return true;
  },

  displayResult() {
    console.log(`${(this.winner.getName() === "Computer") ? "The Computer" : "You"} won this round!`);
  }

};


let Game = {
  init() {
    let human = Object.create(Human).init();
    let computer = Object.create(Computer).init();
    this.playerList = [human, computer];
    this.gamesToWin = undefined;
    this.winner = undefined;
    return this;
  },

  resetMarkers() {
    this.playerList.forEach(player => {
      player.resetMarker();
    });
  },

  resetScores() {
    this.playerList.forEach(player => {
      player.score.resetScore();
    });
  },

  displayMatchWinner() {
    let winner = this.getWinner();
    console.log(`${(winner.name === "Computer") ? "The Computer" : "You"} won the match!`);
  },

  getWinner() {
    let player;
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.score.getScore() === this.gamesToWin) {
        player = currentPlayer;
      }
    }
    return player;
  },

  displayScore() {
    let [human, computer] = this.playerList;

    console.log("-------------------------");
    console.log(`Player: ${human.score.getScore()} | Computer: ${computer.score.getScore()}`);
    console.log("-------------------------");
  },

  isMarkerUnique(marker) {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let player = this.playerList[idx];
      if (marker === player.getMarker()) return false;
    }
    return true;
  },

  getMarker(player) {
    let answer;
    while (true) {
      console.log(`Choose a single and unique character that you would like ${player.name} to use for the game?(ex: "x", "o",)?`);
      answer = readline.question();
      if (answer && answer.length === 1 && this.isMarkerUnique(answer)) break;
      console.log("Invalid character. Make sure you provide a unique character!");
    }
    return answer;
  },


  matchWon() {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.score.score === this.gamesToWin) return true;
    }
    return false;
  },

  playAgain() {
    let answer;
    while (true) {
      console.log("Would you like to play again? (y/n)");
      answer = readline.question().toLowerCase();
      if (["y", "n"].includes(answer)) break;
    }
    return answer === "y";
  },

  continue() {
    console.log("press the enter key to continue");
    readline.question();
  },


  play() {
    while (true) {
      this.initialSetup();
      while (true) {
        let round = Object.create(Round).init(this.playerList);
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
  },

  displayRules() {
    console.log(`The first player to win ${this.gamesToWin} rounds wins the match. To win a round you need to be the first to fill an entire row with your symbol. Vertical, Horizontal, and Diagonal Rows are all considered.`);
  },

  initialSetup() {
    this.gamesToWin = this.getGamesToWin();
    this.displayRules();
    this.resetScores();
    this.resetMarkers();
    this.playerList.forEach((player) => {
      player.setMarker(this.getMarker(player));
    });

  },

  getGamesToWin() {
    let answer;

    while (true) {
      console.log("What score do you want to play to in this match?");
      answer = readline.question();
      if (Number(answer) && answer > 0) break;

      console.log("Invalid score. Provide an integer greater than 0.");
    }
    return Number(answer);
  }
};

//let game = new Game();
let game = Object.create(Game).init();
game.play();