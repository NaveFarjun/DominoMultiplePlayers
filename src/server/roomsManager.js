const games = new Map();
const onlinePlayers = [];
var roomList = [];
var numOfGames = 0;


function isThisNameAllreadyExist(name){
    for(player in onlinePlayers ){
        if(player.name==name){
            return true;
        }
        return false;
    }
}
function addPlayer(name) {
    const player = new (require('./player.js'))(name);
    onlinePlayers.push(player);
}

function addGame(game) {
    numOfGames++;
    games.set(numOfGames, game);
    game.roomInfo.setRoomNum(numOfGames);
    roomList.push(game.roomInfo);
}
function getGames() { return games; }

function getPlayerList() { return onlinePlayers; }

function getRoomList() { return roomList; }

function setRoomList(value) { return roomList=value; }


module.exports = { isThisNameAllreadyExist, addGame, addPlayer, getGames, getPlayerList, getRoomList, setRoomList }