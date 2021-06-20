const readline = require('readline-sync');

class Score {
  constructor() {
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}

class Square {
  static UNUSED_SQUARE = " ";
  constructor(squareNum) {
    this.number = squareNum;
    this.available = true;
    this.mark = Square.UNUSED_SQUARE;
  }

  setAvailablility(availability) {
    this.available = availability;
  }

  getAvailability() {
    return this.available;
  }

  getMark() {
    return this.mark;
  }

  setMark(mark) {
    this.mark = mark;
  }

  getSquareNumber() {
    return this.number;
  }

}

class Row {
  constructor(startingCol, count) {
    this.squares = this.createRow(startingCol, count);
  }

  createRow(startNumber, count) {
    let squares = [];
    for (let idx = startNumber; idx < startNumber + count; idx += 1) {
      squares.push(new Square(idx));
    }
    return squares;
  }

}

class Board {
  constructor(size) {
    this.NumOfRows = size;
    this.rows = this.createRows(this.NumOfRows);
  }

  getCenter() {
    if (this.NumOfRows % 2 === 0) return undefined;
    let center = Math.floor(this.NumOfRows / 2);
    return this.rows[center].squares[center];
  }

  isCenterAvailable() {
    let center = this.getCenter();
    if (!center) return false;

    return center.getAvailability();
  }

  findSquare(squareNum) {
    let found;
    this.rows.forEach((row) => {
      row.squares.forEach((square) => {
        if (square.getSquareNumber() === squareNum) {
          found = square;
        }
      });
    });
    return found;
  }

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
  }

  getAvailableSquareNumbers() {
    let squares = this.getAvailableSquares();
    return squares.map((square) => square.getSquareNumber());
  }

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
  }

  createRows(dimension) {
    let rows = [];
    let counter = 1;
    for (let idx = 1; idx <= dimension; idx += 1) {
      rows.push(new Row(counter, dimension));
      counter += dimension;
    }
    return rows;
  }

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
  }

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
  }


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
  }

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
  }

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
}


class Player {

  constructor(marker = undefined) {
    this.marker = marker;
    this.score = new Score();
  }

  resetMarker() {
    this.marker = undefined;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

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
}

class Human extends Player {
  constructor(marker) {
    super(marker);
    this.name = "Player";
  }


  getName() {
    return this.name;
  }

  chooseMove(board, joinOr) {
    let move;
    while (true) {
      console.log(`Pick the number that corresponds with the square you want to mark. The available squares are: (${joinOr(board.getAvailableSquareNumbers())})`);
      console.log("If you forgot how the squares on the board are numbered enter the number 'h' for help.");
      move = readline.question().toLowerCase();

      if (move === "h") {
        board.help();
        console.clear();
        board.display();
        continue;
      }

      move = Number(move);
      if (board.isSquareAvailable(move)) break;
      console.log("Invalid Selection. Choose an open square.");
    }
    return move;

  }

}

class Computer extends Player {
  constructor(marker) {
    super(marker);
    this.name = "Computer";
  }

  getName() {
    return this.name;
  }

  chooseMove(board, atRiskSquare) {
    if (atRiskSquare) return atRiskSquare;
    if (board.isCenterAvailable()) return board.getCenter().number;
    let possibleMoves = board.getAvailableSquares();
    let randomIdx = Math.floor(Math.random() * (possibleMoves.length - 1));

    return possibleMoves[randomIdx].number;
  }


}

class Round {
  constructor(playerList) {
    this.playerList = playerList;
    this.board = new Board(3);
    this.winner = "";

  }

  static joinOr(array, delimiter = ", ", endingWord = "or") {
    if (array.length === 1) return array[0];
    if (array.length === 2) return `${array[0]} ${endingWord} ${array[1]}`;
    return array.slice(0, array.length - 1).join(delimiter) + `${delimiter}${ endingWord} ` + array[array.length - 1];
  }


  testMove(player, move) {
    player.mark(move, this.board);
    let isWinnable = this.isWinner();
    let moveToUndo = this.board.findSquare(move);
    moveToUndo.setAvailablility(true);
    moveToUndo.setMark(Square.UNUSED_SQUARE);

    return isWinnable;

  }


  findBestMove(computer) {
    let availableMoves = this.board.getAvailableSquareNumbers();
    let atRiskSquares = [];
    for (let idx = 0; idx < availableMoves.length; idx += 1) {
      let move = availableMoves[idx];
      if (this.testMove(computer, move)) return move;

      let possibleMoves = this.playerList.some((player) => {
        return this.testMove(player, move);
      });
      if (possibleMoves > 0) {
        atRiskSquares.push(move);
      }
    }

    return (atRiskSquares.length) ? atRiskSquares[0] : 0;
  }


  winnableRows() {
    let winnableRows = [];
    this.board.getVerticalRows().forEach((row) => winnableRows.push(row));
    this.board.rows.forEach((row) => winnableRows.push(row.squares));
    this.board.getDiagonalRows().forEach((row) => winnableRows.push(row));
    return winnableRows;
  }

  findPlayerByMark(mark) {
    let player;
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.getMarker() === mark) {
        player = currentPlayer;
      }
    }
    return player;
  }

  getRoundWinner() {
    let possibleWins = this.winnableRows();
    let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
    let winningMark = winningRow[0][0].getMark();
    return this.findPlayerByMark(winningMark);
  }

  isWinner() {
    let possibleWins = this.winnableRows();
    let winningRow = possibleWins.filter((row) => this.isRowComplete(row));
    return winningRow.length > 0;
  }

  playerSelections(board) {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let player = this.playerList[idx];
      let move;
      if (player instanceof Human) {
        this.board.display();
        move = player.chooseMove(board, Round.joinOr);
      } else {
        move = player.chooseMove(board, this.findBestMove(player));
      }
      player.mark(move, board);
      if (this.isWinner() || board.isFull()) break;
    }
  }

  playRound(playerList) {
    while (true) {
      this.playerSelections(this.board, playerList);
      if (this.isWinner()) {
        this.winner = this.getRoundWinner();
        this.winner.score.incrementScore();
        this.board.display();
        this.displayResult();
        break;
      }
      if (this.board.isFull()) {
        this.winner = "tie";
        this.board.display();
        console.log("The board is full. This round is a tie!");
        break;
      }
    }

  }

  isRowComplete(row) {
    let mark = row[0].mark;
    if (mark === " ") return false;

    for (let idx = 1; idx < this.board.NumOfRows; idx += 1) {
      let currentMark = row[idx].mark;
      if ((currentMark !== mark)) return false;
    }
    return true;
  }

  displayResult() {
    console.log(`${(this.winner.getName() === "Computer") ? "The Computer" : "You"} won this round!`);
  }

}


class Game {
  constructor() {
    this.playerList = [new Human(), new Computer()];
    this.gamesToWin = undefined;
    this.winner = undefined;
  }

  changeFirstPlayer() {
    this.playerList.push(this.playerList.shift());
  }

  resetMarkers() {
    this.playerList.forEach(player => {
      player.resetMarker();
    });
  }

  resetScores() {
    this.playerList.forEach(player => {
      player.score.resetScore();
    });
  }

  displayMatchWinner() {
    let winner = this.getWinner();
    console.log(`${(winner.name === "Computer") ? "The Computer" : "You"} won the match!`);
  }

  getWinner() {
    let player;
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.score.getScore() === this.gamesToWin) {
        player = currentPlayer;
      }
    }
    return player;
  }

  constructScoreString() {
    let result = "";

    this.playerList.forEach((player) => {
      if (result.length > 0) {
        result += " | ";
      }
      result += `${player.name}: ${player.score.getScore()}`;
    });

    return result;
  }

  displayScore() {
    console.log("-------------------------");
    console.log(this.constructScoreString());
    console.log("-------------------------");
  }

  isMarkerUnique(marker) {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let player = this.playerList[idx];
      if (marker === player.getMarker()) return false;
    }
    return true;
  }

  getMarker(player) {
    let answer;
    while (true) {
      console.log(`Choose a single and unique character that you would like ${player.name} to use for the game?(ex: "x", "o",)?`);
      answer = readline.question();
      if (answer && answer.length === 1 && this.isMarkerUnique(answer)) break;
      console.log("Invalid character. Make sure you provide a unique character!");
    }
    return answer;
  }


  matchWon() {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let currentPlayer = this.playerList[idx];
      if (currentPlayer.score.score === this.gamesToWin) return true;
    }
    return false;
  }

  playAgain() {
    let answer;
    while (true) {
      console.log("Would you like to play again? (y/n)");
      answer = readline.question().toLowerCase();
      if (["y", "n"].includes(answer)) break;
    }
    return answer === "y";
  }

  continue() {
    console.log("press the enter key to continue");
    readline.question();
  }


  play() {
    console.log("Welcome to Tic Tac Toe. Be the first to fill an entire row with your symbol to win. Vertical, Horizontal, and Diagonal Rows are all considered.");
    while (true) {
      this.initialSetup();
      while (true) {
        let round = new Round(this.playerList);
        round.playRound(this.playerList);
        this.displayScore();
        if (this.matchWon()) break;

        this.continue();
        this.changeFirstPlayer();
        console.clear();
      }
      this.displayMatchWinner();
      if (!this.playAgain()) {
        console.log("Thank you for playing! Goodbye.");
        break;
      }
    }
  }

  displayGamesToWin() {
    console.log(`The first player to win ${this.gamesToWin} games wins the match.`);
  }

  initialSetup() {
    this.gamesToWin = this.getGamesToWin();
    this.displayGamesToWin();
    this.resetScores();
    this.resetMarkers();
    this.playerList.forEach((player) => {
      player.setMarker(this.getMarker(player));
    });

  }

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
}


let game = new Game();
game.play();

