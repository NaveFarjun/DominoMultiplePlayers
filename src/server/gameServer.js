const express = require('express');
const roomsManager = require('./roomsManager');
const gameServer = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./auth');

gameServer.use(cookieParser());

gameServer.use(bodyParser.json());

gameServer.use(bodyParser.urlencoded({ extended: true }));

gameServer.get('/gameData', (req, res) => {
  var thisGame = roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  if(!thisGame){
    res.status(403).send('Game Not Found!');
  }
  else{ 
    res.json(thisGame);
  }
});
gameServer.get('/getPlayerIndex', (req, res) => {
  var thisGame = roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  if(!thisGame){
    res.status(403).send('Game Not Found!');
  }
  else{ 
    var index;
    for(var i=0;i<thisGame.players.length;i++){
      if(thisGame.players[i].name==auth.getUserInfo(req.session.id).name){
        index=i;
      }
    }
    res.json(index);
  }
});
gameServer.post('/TileClick', (req, res) => {
  var thisGame = roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  var tile={First: req.body.First, Second:req.body.Second}
  thisGame.setChosenTile(tile);
  thisGame.calculateLeagalMoves();
  res.sendStatus(200);
});
gameServer.post('/CellClick', (req, res) => {
  var thisGame = roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  //console.log(req.body.cell);
  var cell=req.body.cell;
  thisGame.handleOnClickTable(cell);
  res.sendStatus(200);
});
gameServer.post('/giveMeTile', (req, res) => {
  var thisGame = roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  if(thisGame.handleWithBringTileClick(auth.getUserInfo.name)){
    res.status(200).json({});
    return;
  }
  else{
    res.status(403).json({ message: "No More Tile In Cash!" });
    return;
  }
});
gameServer.post('/cleanGame',(req,res)=>{
  var thisGame=roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  if(!thisGame){
    res.status(403).send('Game Not Found!');
  }
  else{ 
    console.log("hereeeeuuusshh")
    thisGame.cleanGame();
    res.status(200).json({});
  }
})
gameServer.post('/decreaseOnlinePlayers',(req,res)=>{
  var thisGame=roomsManager.getGames().get(parseInt(req.cookies.gameNum));
  if(!thisGame){
    console.log("hrerererer")
    res.status(403).send('Game Not Found!');
  }
  else{ 
    console.log("hrerererer222")
    thisGame.roomInfo.onlinePlayers=thisGame.roomInfo.onlinePlayers-1;
    res.status(200).json({});
  }
})
gameServer.get('/klop', (req, res) => {
  var thisGame = roomsManager.getGames().get(1);
  res.json(thisGame.getValidCells());
});
module.exports=gameServer;
