
class Game{
    constructor(numOfPlayers) {
        var  tempCash=[] ;
        this.players = [];
        this.playerDecks=[];
        for(var i=0; i <7;i++){
            for(var j=i; j<7;j++){
                tempCash.push({First: i, Second: j});
            }
        }
        let tableSize=9;
        var boardMatrix= new Array(9);
        for (var i = 0; i < boardMatrix.length; i++) {
            boardMatrix[i] = new Array(9).fill(null);
        }
        this.validCells=[];
        this.chosenTile=null;
        this.currentTurn=null;  //the name of the currnet player
        this.currentPlayerIndex=0;
        this.tableSize=tableSize;
        this.boardMatrix=boardMatrix;
		this.cash = tempCash;
		this.message = undefined;
		this.roomInfo = new (require('./roomInfo.js'))();
		this.gameRunning = false;
		this.numOfUsersWithdraw = 0;
        this.finishGame = false;
        this.numOfTurnsInGeneral=0;
        this.startTime =null;
        this.winner=null;
        
    }
    getValidCells(){
        return  this.validCells;
    }
    setChosenTile(tile){
        this.chosenTile=tile;
    }
    getChosenTile(tile){
        return this.chosenTile;
    }
    getCurrentTurnName(){
        return this.currentTurn;
    }
    setCurrentTurn(playerName){
        this.currentTurn=playerName
    }
    setCreator(creator){
        this.roomInfo.setCreator(creator);
    }
    setTotalPlayers(numOfPlayers){
        this.roomInfo.setTotalPlayers(numOfPlayers);
    }
    reSizeMatrix(Matrix){
        var newMatrix= new Array(Matrix.length+2);
        for (var i = 0; i < Matrix.length+2; i++) {
            newMatrix[i] = new Array(Matrix.length+2).fill(null);
        }
        for(var i=0; i < Matrix.length; i++){
            for(var j=0; j < Matrix.length; j++){
                newMatrix[i+1][j+1]=Matrix[i][j];
            }
        }
        return newMatrix;
    }
    increaseNumOfPlayers(){
        this.roomInfo.increaseOnlinePlayers();
    }
    setGameName(name){
        this.roomInfo.setGameTitle(name);
    }
    addPlayer(name){
        this.roomInfo.increaseOnlinePlayers();
        var newPlayer=new(require('./player.js'))(name);
        for(var i=0; i < 6;i++){
            var RandomNumber = Math.floor(Math.random() * this.cash.length);
            newPlayer.deck.push(this.cash[RandomNumber]);
            newPlayer.score+=this.cash[RandomNumber].First+this.cash[RandomNumber].Second;
            this.cash = this.cash.filter(item => (item.First !== this.cash[RandomNumber].First || item.Second !== this.cash[RandomNumber].Second));
        }
        this.playerDecks.push(newPlayer.getDeck());
        this.players.push(newPlayer);
        if(this.players[0].name==name){
            this.currentTurn=name;
        }
        if(this.roomInfo.onlinePlayers==this.roomInfo.totalPlayers){
            this.roomInfo.startGame=true;
            this.startTime= new Date().getTime();
            this.players[0].startTurnTimer=this.startTime;
        }
    }
    getTotalPlayers() {
        return this.roomInfo.getTotalPlayers();
    }

    getOnlinePlayers() {
        return this.roomInfo.getOnlinePlayers();
    }
    removePlayer(name){
        this.roomInfo.decreaseOnlinePlayers();
        var playerToDel;

        for(var i=0; i < this.players.length;i++){
            if(this.players[i].name==name){
                playerToDel=this.players[i];
            }
        }
        for(var j=0; j < playerToDel.deck.length;j++){
            this.cash.push(playerToDel.deck[j]);
        }
        this.players=this.players.filter(item=>item.name!==name);
    }
    getBoardMatrix(){
        return this.boardMatrix;
    }
    getBoardSize(){
        return this.tableSize;
    }
    getPlayer(name){
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].name==name){
                return this.players[i];
            }
        }
    }
    getNumOfTurnsInGeneral(){
        return this.numOfTurnsInGeneral;
    }
    calculateLeagalMoves(){
        this.validCells=[];
        if(this.numOfTurnsInGeneral==0){
            this.validCells.push('cell4-4');
        }
        else{
            var theBoard=this.boardMatrix;
            for(var i= 0 ; i < this.tableSize ; i++){
                for(var j= 0; j < this.tableSize ; j++){
                    if(theBoard[i][j]!=null && theBoard[i][j]!=undefined ){
                        var tmpValid=this.checkIfNeihboursAreValidCells(theBoard[i][j],i,j,this.chosenTile);
                        for(var k=0; k<tmpValid.length; k++){
                            this.validCells.push(tmpValid[k]);
                        }      
                    }
                }
            }
        }
    }

    checkIfNeihboursAreValidCells(boardCell,i,j,chosen){
        var chosen=chosen;
        var newValidCells=[]
        var position;
        if(boardCell.First == boardCell.Second && (chosen.First==boardCell.First || chosen.Second==boardCell.First)){
            if(!this.boardMatrix[i-1][j]){
                newValidCells.push(`cell${i-1}-${j}`)
            }
            if(!this.boardMatrix[i+1][j]){
                newValidCells.push(`cell${i+1}-${j}`)
            }
            if(!this.boardMatrix[i][j-1]){
                newValidCells.push(`cell${i}-${j-1}`)
            }
            if(!this.boardMatrix[i][j+1]){
                newValidCells.push(`cell${i}-${j+1}`)
            }
        }
        if(boardCell.First != boardCell.Second){
            position=boardCell.position;
            if(position=="FirstLeft"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i}-${j-1}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i}-${j+1}`)
                }
            }
            if(position=="FirstRight"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i}-${j+1}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i}-${j-1}`)
                }
            }
            if(position=="FirstUp"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i-1}-${j}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i+1}-${j}`)
                }
            }
            if(position=="FirstDown"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i+1}-${j}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i-1}-${j}`)
                }
            }
        }
        return newValidCells;
    }
    checkIfTileContainsNumber(num,Tile){
        if(num==Tile.First || num==Tile.Second){
            return true;
        }
    }
    handleOnClickTable(cell){
        this.validCells=[];
        let newMatrix=this.boardMatrix;
        let row=this.bringFirstIdxOfCellId(cell);
        let col=this.bringSecondIdxOfCellId(cell);
        let i=parseInt(row);
        let j=parseInt(col);
        if(i==0 || i==newMatrix.length-2 || j==0 || j==newMatrix.length-2){
            newMatrix=this.reSizeMatrix(newMatrix);
            i++;
            j++;
            this.tableSize=newMatrix.length;
        }
        var position;
        if(this.numOfTurnsInGeneral==0){
            position="FirstLeft";
        }
        else{
            position=this.chosePositionToTile(newMatrix,i,j);
        }
        this.numOfTurnsInGeneral++;
        newMatrix[i][j]={First: this.chosenTile.First, Second:this.chosenTile.Second, position:position };
        let newScore=this.players[this.currentPlayerIndex].score-this.chosenTile.First-this.chosenTile.Second;
        this.players[this.currentPlayerIndex].score=newScore;
        this.players[this.currentPlayerIndex].deck=this.players[this.currentPlayerIndex].deck.filter(value=>value.First!==this.chosenTile.First || value.Second!==this.chosenTile.Second);
        this.updateStatistics();
    
        if(this.AmIWinner()){ 
            var counter=0;
            for(var k = 0 ; k < this.players.length;k++){
                if(this.players[k].deck.length==0){
                    counter++;
                }
            }
            if(counter==this.roomInfo.onlinePlayers-1){
                this.finishGame=true;
            }
        }
        this.changeTurn();
        this.boardMatrix=newMatrix;

    }
    AmIWinner(){
        if(this.players[this.currentPlayerIndex].deck.length==0){
            if(this.winner==null){
                this.winner=this.currentTurn;
            }
           
            return true;
        }
    }

    changeTurn(){
        this.currentPlayerIndex=(this.currentPlayerIndex+1)%(this.roomInfo.getOnlinePlayers());
        this.currentTurn=this.players[this.currentPlayerIndex].name;
        if(this.players[this.currentPlayerIndex].deck.length==0){
            this.currentPlayerIndex=(this.currentPlayerIndex+1)%(this.roomInfo.getOnlinePlayers());
            this.currentTurn=this.players[this.currentPlayerIndex].name;
        }
        this.players[this.currentPlayerIndex].startTurnTimer=new Date().getTime();
    }
    
    chosePositionToTile(Matrix, i, j){
        var chosen=this.chosenTile;
        var position;
        if(Matrix[i-1][j]!==null){
            if((Matrix[i-1][j].position=="FirstLeft" || Matrix[i-1][j].position=="FirstRight") && Matrix[i-1][j].First==Matrix[i-1][j].Second ){
                if(chosen.First==Matrix[i-1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].First){
                    position="FirstDown";
                }
            }
            else if(Matrix[i-1][j].position=="FirstUp"){
                if(chosen.First==Matrix[i-1][j].Second){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].Second){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i-1][j].Second && chosen.First==Matrix[i-1][j].Second){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i-1][j].position=="FirstDown"){
                if(chosen.First==Matrix[i-1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i-1][j].First && chosen.First==Matrix[i-1][j].First){
                    position="FirstLeft";
                }
            }
            else{

            }
        }
        if(Matrix[i][j-1]!==null){
            if((Matrix[i][j-1].position=="FirstUp" || Matrix[i][j-1].position=="FirstDown") && Matrix[i][j-1].First==Matrix[i][j-1].Second ){
                if(chosen.First==Matrix[i][j-1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].First){
                    position="FirstRight";
                }
            }
            else if(Matrix[i][j-1].position=="FirstLeft"){
                if(chosen.First==Matrix[i][j-1].Second){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].Second){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j-1].Second && chosen.First==Matrix[i][j-1].Second){
                    position="FirstUp";
                }
                
            }
            else if(Matrix[i][j-1].position=="FirstRight"){
                if(chosen.First==Matrix[i][j-1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j-1].First && chosen.First==Matrix[i][j-1].First){
                    position="FirstUp";
                }
            }
            else{
                
            }
        }
        if(Matrix[i][j+1]!=null){
            if((Matrix[i][j+1].position=="FirstUp" || Matrix[i][j+1].position=="FirstDown") && Matrix[i][j+1].First==Matrix[i][j+1].Second ){
                if(chosen.First==Matrix[i][j+1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].First){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i][j+1].position=="FirstLeft"){
                if(chosen.First==Matrix[i][j+1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j+1].First && chosen.First==Matrix[i][j+1].First){
                    position="FirstUp";
                }
            }
            else if(Matrix[i][j+1].position=="FirstRight"){
                if(chosen.First==Matrix[i][j+1].Second){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].Second){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j+1].Second && chosen.First==Matrix[i][j+1].Second){
                    position="FirstUp";
                }
            }
            else{
                
            }
        }  
        if(position===undefined){
            if((Matrix[i+1][j].position=="FirstLeft" || Matrix[i+1][j].position=="FirstRight") && Matrix[i+1][j].First==Matrix[i+1][j].Second ){
                if(chosen.First==Matrix[i+1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].First){
                    position="FirstUp";
                }
            }
            else if(Matrix[i+1][j].position=="FirstUp"){
                if(chosen.First==Matrix[i+1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i+1][j].First && chosen.First==Matrix[i+1][j].First){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i+1][j].position=="FirstDown"){
                if(chosen.First==Matrix[i+1][j].Second){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].Second){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i+1][j].Second && chosen.First==Matrix[i+1][j].Second){
                    position="FirstLeft";
                }
            }
            else{
                
            }
        }
        return position;
    }
    bringFirstIdxOfCellId(cellId){
        var i=0;
        while(cellId.charAt(i)!='-'){
            i++;
        }
        var number=cellId.substring(4,i);
        return number;
    }
    bringSecondIdxOfCellId(cellId){
        var i=0;
        while(cellId.charAt(i)!='-'){
            i++;
        }
        var number=cellId.substring(i+1,cellId.length);
        return number;
    }
    handleWithBringTileClick(name){
        this.validCells=[];
        if(this.cash.length>0){
            var RandomNumber = Math.floor(Math.random() * this.cash.length);
            let newPlayerDeck = this.players[this.currentPlayerIndex].deck;
            var newScore=this.players[this.currentPlayerIndex].score;
            newPlayerDeck.push(this.cash[RandomNumber]);
            newScore=newScore+this.cash[RandomNumber].First+this.cash[RandomNumber].Second;
            this.players[this.currentPlayerIndex].score=newScore;
            let newCash = this.cash;
            this.players[this.currentPlayerIndex].howMantTimesTookFromCash=this.players[this.currentPlayerIndex].howMantTimesTookFromCash+1;
            newCash = newCash.filter(item => (item.First !== this.cash[RandomNumber].First || item.Second !== this.cash[RandomNumber].Second) );
            this.players[this.currentPlayerIndex].deck=newPlayerDeck;
            this.cash=newCash;  
           return true;
        }
        else{
            return false;
        }
    }
    updateStatistics()
    {
        this.players[this.currentPlayerIndex].numOfTurns++;
        this.players[this.currentPlayerIndex].totalTime += new Date().getTime() - this.players[this.currentPlayerIndex].startTurnTimer;
        this.players[this.currentPlayerIndex].avgActionTime = ( this.players[this.currentPlayerIndex].totalTime/ this.players[this.currentPlayerIndex].numOfTurns);
    }
    
    cleanGame(){
        this.roomInfo.onlinePlayers=0;
        this.roomInfo.startGame=false;
        var  tempCash=[] ;
        this.players = [];
        this.playerDecks=[];
        for(var i=0; i <7;i++){
            for(var j=i; j<7;j++){
                tempCash.push({First: i, Second: j});
            }
        }
        let tableSize=9;
        var boardMatrix= new Array(9);
        for (var i = 0; i < boardMatrix.length; i++) {
            boardMatrix[i] = new Array(9).fill(null);
        }
        this.validCells=[];
        this.chosenTile=null;
        this.currentTurn=null;  //the name of the currnet player
        this.currentPlayerIndex=0;
        this.tableSize=tableSize;
        this.boardMatrix=boardMatrix;
		this.cash = tempCash;
		this.message = undefined;
		this.gameRunning = false;
		this.numOfUsersWithdraw = 0;
        this.finishGame = false;
        this.numOfTurnsInGeneral=0;
        this.startTime =null;
        this.winner=null;
    }
}


module.exports=Game;