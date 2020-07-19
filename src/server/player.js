class Player {
    constructor(name) {
        this.deck = [];
        this.win = false;
        this.name = name;
        this.score=0;
        this.howMantTimesTookFromCash=0;
        this.totalTime=0;
        this.numOfTurns=0;
        this.avgActionTime=0;
        this.startTurnTimer=null;
    }

    getDeck() {
        return this.deck;
    }
    setDeck(value){
        this.deck=value;
    }

}

module.exports = Player;