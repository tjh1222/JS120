
let readline = require('readline-sync');

class Card {
  static CARD_HEIGHT = 6;
  static RANK_TO_POINTS = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: 11
  };
  constructor(suit, rank, hidden = false) {

    this.suit = suit;
    this.rank = rank;
    this.hidden = hidden;
    this.points = Card.RANK_TO_POINTS[this.rank];
  }

  setHidden(hidden) {
    this.hidden = hidden;
  }

  getSuit() {
    return this.suit;
  }

  getRank() {
    return this.rank;
  }

  toString() {
    if (this.hidden) return this.hiddenCard();

    let cardString = "";
    cardString += "---------\n";
    cardString += `|${(this.suit.length === 1) ? this.suit + " " : this.suit}     |\n`;
    cardString += "|       |\n";
    cardString += `|   ${(this.rank.length === 1) ? this.rank + " " : this.rank}  |\n`;
    cardString += "|       |\n";
    cardString += `---------`;
    return cardString;
  }

  hiddenCard() {
    let cardString = "";
    cardString += "---------\n";
    cardString += `|       |\n`;
    cardString += "|       |\n";
    cardString += `|       |\n`;
    cardString += "|       |\n";
    cardString += `---------`;
    return cardString;
  }
}

class Ace extends Card {
  static LOW_ACE_VALUE = 1;
  static rank = "A";

  constructor(suit, rank, hidden = false) {
    super(suit, rank, hidden);
  }

  togglePoints() {
    this.points = Ace.LOW_ACE_VALUE;
  }
}

class Hand {
  static MAX_HAND_VALUE = 21;
  constructor(cards = []) {
    this.cards = cards;
    this.points = this.calculateHandValue();
    this.result = "";
  }

  setResult(result) {
    this.result = result;
  }

  toString() {
    let result = [];
    let splitCards = this.cards.map((card) => card.toString().split("\n"));

    for (let idx = 0; idx < Card.CARD_HEIGHT; idx += 1) {
      let line = "";
      for (let idy = 0; idy < splitCards.length; idy += 1) {
        line += splitCards[idy][idx] + " ";
      }
      result.push(line);
    }

    return result.join("\n");

  }

  adjustPoints() {
    this.points = this.calculateHandValue();
  }

  calculateHandValue() {
    if (this.isBusted()) {
      for (let idx = 0; idx < this.cards.length; idx += 1) {
        let card = this.cards[idx];
        if (card instanceof Ace) {
          card.togglePoints();
        }

        if (!this.isBusted()) break;
      }
    }

    return this.cards.reduce((accum, card) => accum + card.points, 0);
  }

  getCards() {
    return this.cards;
  }

  addCards(cards) {
    cards.forEach(card => {
      this.cards.push(card);
      this.adjustPoints();
    });
  }

  isBusted() {
    return (this.points > Hand.MAX_HAND_VALUE);
  }

}


class Deck {
  static ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  static suits = ['♡', '♢', '♤', '♧'];
  constructor() {
    this.cards = this.shuffle(this.newCards());
  }

  newCards() {
    let deck = [];
    for (let idx = 0; idx < Deck.ranks.length; idx += 1) {
      let rank = Deck.ranks[idx];
      for (let idy = 0; idy < Deck.suits.length; idy += 1) {
        let suit = Deck.suits[idy];
        if (rank === Ace.rank) {
          deck.push(new Ace(suit, rank));
        } else {
          deck.push(new Card(suit, rank));
        }
      }
    }
    return deck;
  }

  shuffle(cards) {
    for (let index = cards.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[otherIndex]] = [cards[otherIndex], cards[index]];
    }
    return cards;
  }

  refillDeck() {
    this.cards = this.shuffle(this.newCards());
  }

}


class Participant {
  constructor(name) {
    this.hand = new Hand();
    this.name = name;
  }

  discard() {
    this.hand = new Hand();
  }

  hit(dealer) {
    console.log(`${this.name} chose to hit!`);
    dealer.deal([this], 1);
  }

  stay() {
    console.log(`${this.name} chose to stay!`);
  }

  bust() {
    this.hand.setResult("loss");
    console.log(`${this.name} busted!`);
  }

}

class Player extends Participant {
  constructor(name, money) {
    super(name);
    this.money = money;
  }

  isOut() {
    return this.money === 0;
  }

  getName() {
    return this.name;
  }

  decrementMoney(amount = 1) {
    this.money -= amount;
  }

  hitOrStay() {
    let answer;
    while (true) {
      console.log("(H)it or (S)tay.");
      answer = readline.question().toLowerCase().trim();
      if (["h", "s"].includes(answer)) break;
      console.log("Invalid Answer");
    }
    return answer;
  }

  incrementMoney(amount = 1) {
    this.money += amount;
  }
}

class Dealer extends Participant {
  static MINIMUM_SCORE = 17;

  constructor(name) {
    super(name);
    this.deck = new Deck();
  }

  getName() {
    return this.name;
  }


  reveal() {
    this.hand.cards.forEach((card) => card.setHidden(false));
  }

  deal(playerList, numOfCards, initialDeal = false) {
    for (let idx = 0; idx < playerList.length; idx += 1 ) {
      let player = playerList[idx];
      if ((player !== this) && player.isOut()) continue;
      for (let idy = 0; idy < numOfCards; idy += 1) {
        let card = this.deck.cards.shift();
        if (player instanceof Dealer && (!idy && initialDeal)) {
          card.setHidden(true);
        }
        player.hand.addCards([card]);
        player.hand.adjustPoints();
      }
    }

  }

  hit() {
    console.log(`\n${this.name} chose to hit.\n`);
    this.deal([this], 1);
  }
}


class TwentyOneGame {
  static MAX_MONEY = 10;
  static STARTING_MONEY = 5;
  static MAX_SCORE = 21;
  static BET_AMOUNT = 1;

  constructor() {

    this.dealer = new Dealer("The Dealer");
    this.playerList = [];
  }

  addPlayers() {

    while (true) {
      let name;
      while (true) {
        console.log("What is the name of the player?");
        name = readline.question();
        if (name.length > 0) break;
        console.log("Invalid Response");
      }

      this.playerList.push(new Player(name, TwentyOneGame.STARTING_MONEY));

      if (!this.anotherPlayer()) break;
    }
    this.playerList.push(this.dealer);

  }

  anotherPlayer() {
    let answer;

    while (true) {
      console.log("Would you like to add another player? (y/n)");
      answer = readline.question().trim().toLowerCase();
      if (["y", "n"].includes(answer)) break;
    }
    return answer === "y";
  }


  playersTurns() {

    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let player = this.playerList[idx];
      if (player instanceof Player) {
        if (player.isOut()) {
          console.log(`${player.name} is out of money. Turn skipped`);
          continue;
        }
        this.playerTurn(player);
      }
    }
  }

  playerTurn(player) {
    while (true) {
      console.log(`\n${player.name}'s Turn\n`);
      this.showCards();
      if (player.hitOrStay() === "h") {
        player.hit(this.dealer);
        this.pauseBeforeClearing();
      } else {
        player.stay();
        this.pauseBeforeClearing();
        break;
      }
      if (player.hand.isBusted()) {
        player.bust();
        this.pauseBeforeClearing();
        break;
      }
    }
  }

  pauseBeforeClearing() {
    this.pressEnterToContinue();
    console.clear();
  }

  constructScoreString() {
    let result = "";

    this.playerList.forEach((player) => {
      if ((player instanceof Player)) {
        if (result.length > 0) {
          result += " || ";
        }
        result += `${player.name}: ${player.money}`;
      }
    });
    return result;
  }

  displayScore() {
    console.log("\n-------Funds Remaining--------\n");
    console.log(this.constructScoreString());
    console.log("\n------------------------------\n");
  }

  dealerTurn() {
    let handTotal = this.dealer.hand.calculateHandValue();
    console.log("The Dealer's Turn\n");
    while (handTotal < Dealer.MINIMUM_SCORE) {
      console.clear();
      console.log("The Dealer's Turn:\n");
      this.showCards(true);
      this.dealer.hit();
      this.pauseBeforeClearing();
      handTotal = this.dealer.hand.calculateHandValue();
    }
  }

  allPlayersBust() {
    let players = this.activePlayers();
    return players.every((player) => player.hand.isBusted());
  }

  activePlayers() {
    return this.removeDealers().filter((player) => !player.isOut());
  }

  collectMoney() {
    let players = this.activePlayers();
    players.forEach((player) => {
      if (player.hand.result === "win") {
        player.incrementMoney();
      } else if (player.hand.result === "loss") {
        player.decrementMoney();
      }
    });
  }

  start() {

    this.displayWelcomeMessage();
    this.displayRules();
    this.pressEnterToContinue();

    this.addPlayers();

    while (true) {
      while (true) {
        this.playRound();
        this.pressEnterToContinue();

        if (this.gameOver()) {
          this.displayMatchResults();
          break;
        }

      }
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  }

  displayRules() {
    console.log(`\nEach Player will compete against the dealer in a game of ${TwentyOneGame.MAX_SCORE}.\n`);
    console.log(`To win, Try to get as close to ${TwentyOneGame.MAX_SCORE} as possible without exceeding.\n\nRoyal Cards are worth 10 points, Aces can be either 11 or 1, and all other cards are worth the number displayed on the card.\n\nHit if you want another card.Stay otherwise.\n`);
    console.log(`Each player will start with ${TwentyOneGame.STARTING_MONEY} dollars. Each round will require betting ${TwentyOneGame.BET_AMOUNT} dollar and to win you need ${TwentyOneGame.MAX_MONEY} dollars.`);
    console.log(`\nThe first Player to win ${TwentyOneGame.MAX_MONEY} dollars wins the game!`);
  }

  playRound() {
    this.dealer.deck.refillDeck();
    console.clear();
    this.resetHands();
    this.dealCards();
    this.playersTurns();
    this.dealer.reveal();
    if (!this.allPlayersBust()) {
      console.clear();
      this.dealerTurn();
    }
    console.clear();
    this.showCards(true);
    this.displayResults();
    this.collectMoney();
    this.displayScore();
  }


  displayMatchResults() {
    let players = this.removeDealers();
    players.forEach((player) => {
      if (player.money === TwentyOneGame.MAX_MONEY) {
        console.log(`${player.name} won ${player.money} dollars!`);
      } else {
        console.log(`${player.name} lost! Funds remaining: ${player.money} dollars.`);
      }
    });
  }

  isRich(player) {
    return player.money === TwentyOneGame.MAX_MONEY;
  }

  isBroke(player) {
    return player.money === 0;
  }

  gameOver() {
    let players = this.removeDealers();
    let checkForWinner = players.some((player) => this.isRich(player));
    let allPlayersBroke = players.every((player) => this.isBroke(player));
    return checkForWinner || allPlayersBroke;
  }


  resetHands() {
    this.playerList.forEach(player => player.discard());
  }

  pressEnterToContinue() {
    console.log("Press Enter Key to Continue.");
    readline.question();
  }


  playAgain() {
    let answer;
    while (true) {
      console.log("Would you like to play again? (y/n)");
      answer = readline.question().toLowerCase().trim();
      if (["y", "n"].includes(answer)) break;

      console.log("Invalid Response. Try Again.");
    }
    return answer === "y";
  }


  dealCards() {
    this.dealer.deal(this.playerList, 2, true);
  }

  isDealer(player) {
    return player instanceof Dealer;
  }

  isPlayer(player) {
    return player instanceof Player;
  }

  showCards(unhideTotal = false) {
    for (let idx = 0; idx < this.playerList.length; idx += 1) {
      let player = this.playerList[idx];
      if (!this.isDealer(player) && player.isOut()) continue;
      console.log(`${player.name}'s hand is:`);
      console.log(player.hand.toString());
      if (unhideTotal && this.isDealer(player)) {
        console.log(`For a total of: ${player.hand.calculateHandValue()}\n`);
      }
      if (this.isPlayer(player)) {
        console.log(`For a total of: ${player.hand.calculateHandValue()}\n`);
      }
    }
  }


  displayWelcomeMessage() {
    console.log(`Welcome to ${TwentyOneGame.MAX_SCORE}.`);
  }

  displayGoodbyeMessage() {
    console.log(`Thank you for playing ${TwentyOneGame.MAX_SCORE}. Goodbye.`);
  }

  isWinner(player, opponent = this.dealer) {
    return player.hand.points > opponent.hand.points;
  }

  checkForTie(p1, p2) {
    return p1.hand.points === p2.hand.points;
  }


  detectResult(dealer, player) {
    let playerTotal = player.hand.points;
    let dealerTotal = dealer.hand.points;

    if (player.hand.isBusted()) {
      player.hand.setResult("loss");
      return 'PLAYER_BUSTED';
    } else if (dealer.hand.isBusted()) {
      player.hand.setResult("win");
      return 'DEALER_BUSTED';
    } else if (dealerTotal < playerTotal) {
      player.hand.setResult("win");
      return 'PLAYER';
    } else if (dealerTotal > playerTotal) {
      player.hand.setResult("loss");
      return 'DEALER';
    } else {
      player.hand.setResult("tie");
      return 'TIE';
    }
  }

  removeDealers() {
    return this.playerList.filter((player) => player instanceof Player);
  }

  displayResults() {
    let players = this.activePlayers();

    players.forEach(player => {
      this.displayResult(player);
    });
  }

  displayResult(player) {
    let result = this.detectResult(this.dealer, player);
    switch (result) {
      case 'PLAYER_BUSTED':
        console.log(`${player.name} busted! Dealer wins the round!`);
        break;
      case 'DEALER_BUSTED':
        console.log(`Dealer busted! ${player.name} wins the round!`);
        break;
      case 'PLAYER':
        console.log(`${player.name} wins the round against the dealer!`);
        break;
      case 'DEALER':
        console.log(`Dealer wins the round against ${player.name} !`);
        break;
      case 'TIE':
        console.log(`${player.name} ties with the dealer!`);
    }
  }

}

let game = new TwentyOneGame();
game.start();