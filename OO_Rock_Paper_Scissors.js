/* eslint-disable max-lines-per-function */
let readline = require("readline-sync");
const GAMES_IN_MATCH = 5;

const WINNING_COMBOS = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  spock: ['scissors', 'rock'],
  lizard: ['paper', 'spock']

};

const CHOICES = Object.keys(WINNING_COMBOS);

function createPlayer() {
  return {
    move: null,


    getMove() {
      return this.move;
    }
  };
}

// eslint-disable-next-line max-lines-per-function
function createComputer() {

  let playerObject = createPlayer();

  let computerObject = {
    choose(moves) {
      let weightedChoices = this.adjustComputerChoice(moves);

      let randomIndex = Math.floor(Math.random() * weightedChoices.length);
      this.move = weightedChoices[randomIndex];
    },

    calculateLossRate(prevMoves, move) {
      let moveHistory = prevMoves.filter((obj) => obj.computerMove === move && obj.winner !== "tie");

      let numberOfWins = moveHistory.reduce((accum, obj) => {
        if (obj.winner === "computer") {
          return accum + 1;
        }
        return accum;
      }, 0);
      let total = moveHistory.length;
      if (total === 0) return 0;

      return ((total - numberOfWins) / total) * 100;
    },

    adjustComputerChoice(moveHistory) {
      let adjustedChoices = [];
      let needAdjustment = CHOICES.some((choice) => {
        return (this.calculateLossRate(moveHistory, choice) >= 60);
      });
      if (!needAdjustment) return CHOICES;

      for (let idx = 0; idx < CHOICES.length; idx += 1) {
        let current = CHOICES[idx];
        let lossRate = this.calculateLossRate(moveHistory, current);
        if (lossRate >= 60) {
          adjustedChoices.push(current);
        } else {
          adjustedChoices.push(current, current);
        }
      }
      return adjustedChoices;
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {

  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;
      let numberOfChoices = CHOICES.length;
      while (true) {
        console.log(`Choose ${CHOICES.slice(0, numberOfChoices - 1).join(", ")} or ${CHOICES[numberOfChoices - 1]}`);
        choice = readline.question().trim().toLowerCase();

        if (CHOICES.includes(choice)) break;

        console.log("Invalid Choice!");
      }
      this.move = choice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

let ScoreBoard = {
  score: {human: 0, computer: 0},
  getScore() {
    return this.score;
  },

  updateScore(winner) {
    if (winner !== "tie") {
      this.score[winner] += 1;
    }
  },

  displayScore() {
    console.log("---------------------------");
    console.log(`Player: ${this.getPlayerScore("human")} || Computer: ${this.getPlayerScore("computer")}`);
    console.log("---------------------------");

  },
  getPlayerScore(player) {
    return this.score[player];
  },

  resetScore() {
    Object.keys(this.score).forEach((player) => {
      this.score[player] = 0;
    });
  },

  getMaxScore() {
    return Math.max(...Object.values(this.score));
  }
};

// eslint-disable-next-line max-lines-per-function
function createRound(human, computer, moveHistory) {
  human.choose();
  computer.choose(moveHistory);
  let [humanMove, computerMove] = [human.getMove(), computer.getMove()];
  let winner;

  if (WINNING_COMBOS[humanMove].includes(computerMove)) {
    winner = "human";
  } else if (WINNING_COMBOS[computerMove].includes(humanMove)) {
    winner = 'computer';
  } else {
    winner = 'tie';
  }

  return {
    humanMove: human.getMove(),
    computerMove: computer.getMove(),
    winner: winner,

    getWinner() {
      return this.winner;
    },

    getHumanMove() {
      return this.humanMove;
    },

    getComputerMove() {
      return this.computerMove;
    }

  };
}


let RPSGame = {
  human: createHuman(),
  history: [],
  computer: createComputer(),

  pressAnyKeyToContinue() {
    console.log("Press Any key to Continue");
    readline.question();
  },


  displayHumanMoves() {
    let moves = [];
    this.history.forEach((move) => {
      moves.push(move.humanMove);
    });
    console.log(`Your previous moves are: ${moves.join(", ")}`);
  },

  displayComputerMoves() {
    let moves = [];
    this.history.forEach((move) => {
      moves.push(move.computerMove);
    });
    console.log(`The Computer's previous moves are: ${moves.join(", ")}`);
  },


  getMoveHistory() {
    return this.history;
  },

  displayRoundWinner(winner) {
    if (winner !== "tie") {
      console.log(`${(winner === "human") ? "You" : "The computer"} won the round!`);
    } else {
      console.log("This round was a tie.");
    }
  },

  displayMatchWinner(winner) {
    console.log(`${(winner === "human") ? "You" : "The computer"} won the match!`);
  },

  displayWelcomeMessage() {
    console.log(`Welcome to ${CHOICES.join(", ")}!`);
    console.log(`The first to ${GAMES_IN_MATCH} wins the match!`);
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing ${CHOICES.join(", ")}. Goodbye!`);
  },

  playAgain() {
    let answer;
    while (true) {
      console.log("Would you like to play again (y or n)?");
      answer = readline.question().trim().toLowerCase();

      if (["y", "n"].includes(answer)) break;

      console.log("Invalid Selection.");
    }
    return answer === "y";
  },

  // eslint-disable-next-line max-lines-per-function
  // eslint-disable-next-line max-statements
  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.pressAnyKeyToContinue();
      console.clear();
      this.displayHumanMoves();
      this.displayComputerMoves();

      ScoreBoard.displayScore();

      let currentRound = createRound(this.human, this.computer, this.history);
      ScoreBoard.displayScore();
      this.history.push(currentRound);
      console.log(`You chose: ${currentRound.getHumanMove()} and the computer chose: ${currentRound.getComputerMove()}`);

      let roundWinner = currentRound.getWinner();
      ScoreBoard.updateScore(roundWinner);
      this.displayRoundWinner(roundWinner);

      if (ScoreBoard.getMaxScore() === GAMES_IN_MATCH) {
        this.displayMatchWinner(roundWinner);
        if (!this.playAgain()) break;
        ScoreBoard.resetScore();
      }
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();