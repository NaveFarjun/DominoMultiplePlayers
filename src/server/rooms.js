const express = require('express');
const rooms = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const roomsManager = require('./roomsManager');
const auth = require('./auth');

rooms.use(cookieParser());

rooms.use(bodyParser.json());

rooms.use(bodyParser.urlencoded({ extended: true }));


rooms.get('/', (req, res) => {
	res.json("fdfd");
});

rooms.post('/createGame', (req, res) => {
	var allRooms = roomsManager.getRoomList();

	for (var i = 0; i < allRooms.length; i++) {
		if (allRooms[i].getGameTitle() == req.body.gameTitle) {
			res.status(403).json({ message: "the name of the room already exist" });
			return;
		}
    }
    
    if(!(req.body.totalPlayers=="3" || req.body.totalPlayers=="2")){
        res.status(403).json({ message: "Total players has to be 2 or 3" });
        return;
    }
    const userInfo =  auth.getUserInfo(req.session.id);
    var newGame=new (require('./game.js'))(req.body.totalPlayers);
    newGame.setGameName(req.body.gameTitle);
    newGame.setTotalPlayers(req.body.totalPlayers);
    newGame.setCreator(userInfo.name);
    roomsManager.addGame(newGame);
    res.status(200).json({});
});
rooms.get('/roomsInfo', (req, res)=>{
    res.json(roomsManager.getRoomList());
});

rooms.post('/enteringRoom', (req,res)=>{
    var gameNum=req.body.gameNum;
    var gameToUpdate = roomsManager.getGames().get(gameNum);
    if(gameToUpdate.getTotalPlayers()==gameToUpdate.getOnlinePlayers()){
        res.status(403).json({ message: "game is full" });
        return;
    }
    else{
        gameToUpdate.addPlayer(req.body.playerName);
        var cookie = req.cookies.cookieName;
        if (cookie === undefined){
            res.cookie('gameNum',gameNum, { maxAge: 900000, httpOnly: true });
            console.log('cookie created successfully');
        } 
        res.status(200).json({});
        return;
    }

});
rooms.post('/leavingRoom', (req,res)=>{
    var num=req.body.gameNum;
    var gameToUpdate = roomsManager.getGames().get(num);
    gameToUpdate.removePlayer(req.body.playerName);
    res.status(200).json({});
    return;
});
rooms.post('/removeRoom',(req,res)=>{
    var num=req.body.roomNum;
    var gameToRemove = roomsManager.getGames().get(num);
    if(!gameToRemove){
        res.status(403).json({ message: "GAME NOT FOUND" });
    }
    if(gameToRemove.roomInfo.creator!=auth.getUserInfo(req.session.id).name){
        res.status(403).json({ message: "only owners of room can delete it" });
    }
    else{
        var allRooms = roomsManager.getRoomList();
        console.log(roomsManager.getRoomList());       
        allRooms=allRooms.filter(value=> value.roomNum!=num);
        roomsManager.setRoomList(allRooms);
        console.log(roomsManager.getRoomList());
        
        res.status(200).json({});

    }
    
})
function filterRooms(value, num){
    return value.roomNum!=num;
};

rooms.get('/koko', (req,res)=>{
    var allRooms = roomsManager.getRoomList();
    res.json(allRooms);
    return;
});

module.exports=rooms;