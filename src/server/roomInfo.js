class RoomInfo {
    constructor() {
        this.roomNum = undefined;
        this.gameTitle = undefined;
        this.creator = undefined;
        this.totalPlayers = 0;
        this.onlinePlayers = 0;
        this.startGame = false;
    }

    clearInfo() {
        this.onlinePlayers = 0;
        this.startGame = false;
    }

    setRoomNum(roomNum) {
        this.roomNum = roomNum;
    }

    getCreator() {
        return this.creator;
    }

    setCreator(creator) {
        this.creator = creator;
    }

    getGameTitle() {
        return this.gameTitle;
    }

    setGameTitle(gameTitle) {
        this.gameTitle = gameTitle;
    }

    getTotalPlayers() {
        return this.totalPlayers;
    }

    setTotalPlayers(totalPlayers) {
        this.totalPlayers = totalPlayers;
    }

    getOnlinePlayers() {
        return this.onlinePlayers;
    }

    setOnlinePlayers(onlinePlayers) {
        this.onlinePlayers = onlinePlayers;
    }

    increaseOnlinePlayers() {
        this.onlinePlayers++;
    }

    decreaseOnlinePlayers() {
        this.onlinePlayers--;
    }
}

module.exports = RoomInfo;


