import React from 'react';
import Board from './Board.jsx';
import Player from './Player.jsx';
import Statistics from './statistics.jsx'; 
import StatisticsSummary from './statisticsSummary.jsx';
import ChatContainer from './chatContainer.jsx';

export default class GameZone extends React.Component{
    constructor(args) {
        super(...args);
        
        this.state = {
            gameData:undefined,
            myIndex:-1,
        }
        this.getGameData=this.getGameData.bind(this);
        this.getPlayerIndex=this.getPlayerIndex.bind(this);
        this.funcy=this.funcy.bind(this);
    }
    componentDidMount() {
        console.log(1);
        this.getGameData();
        this.getPlayerIndex();
    }

    componentWillUnmount() {
        if (this.timeoutId1) {
            clearTimeout(this.timeoutId1);
        }
        this.isCancelled = true;
    }
    getGameData(){
        return fetch('game/gameData', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId1 = setTimeout(this.getGameData, 200);
            return response.json();            
        })
        .then(content => {
            var newContent=content;
            this.setState({gameData: newContent});
            if(this.state.myIndex == -1)
            {
                this.getPlayerIndex();
            }
        })
        .catch(err => {throw err});
    }
    getPlayerIndex()
    {
        return fetch('game/getPlayerIndex', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            return response.json();            
        })
        .then(result => {
            this.setState({myIndex:result})
        })
        .catch(err => {throw err});
    }
    handleBringTileClick(){
        fetch('game/giveMeTile', {method: 'POST', credentials: 'include'})
        .then((response) => {
            if (response.status === 403 || response.status === 200) {
                return response.json();
            }            
        })
        .then((res)=>{
            if(res.message){
                window.alert(res.message);
            }
        })
        
        .catch(err => {throw err});
    }
    cleanGameData(){
        fetch('game/cleanGame',{method:'POST',credentials:'include'})
        .then((response)=>{
            if (!response.ok){
                throw response;
            }
            return response.json();
        })
    }
    decreaseOnlinePlayers(){
        fetch('game/decreaseOnlinePlayers',{method:'POST',credentials:'include'})
        .then((response)=>{
            if (!response.ok){
                throw response;
            }
            return response.json();
        })
    }
    funcy(){
        if(this.state.gameData.roomInfo.onlinePlayers==1){ //i am the last in room
            this.cleanGameData();
        }
        else{
            this.decreaseOnlinePlayers();
        }
        this.props.returnToRooms();
    }
    render(){
        if(this.state.myIndex==-1 || this.state.gameData=={} || this.state.gameData==undefined){
            return null;
        }
        else if(this.state.gameData.roomInfo.onlinePlayers!=this.state.gameData.roomInfo.totalPlayers && this.state.gameData.roomInfo.startGame==false){
            return (
                <div className="centerTwo">
                <div>
                   <p>
                   waiting for all players!<br />
                   online players:{this.state.gameData.roomInfo.onlinePlayers}<br />
                   requsted number of players:{this.state.gameData.roomInfo.totalPlayers}<br />
                    </p>
               </div>  
               <Player playerDeck = {this.state.gameData.players[this.state.myIndex].deck} isDisable={this.state.gameData.currentTurn==this.props.myName?false:true}></Player>
           </div>
            )
        }
        else if(this.state.gameData.finishGame==true){
            return(
                <div>
                    <StatisticsSummary returnToRooms={this.funcy} winnerName={this.state.gameData.winner} players={this.state.gameData.players}></StatisticsSummary>
                    <div className="center">
                         <div className="scroll">
                            <Board matrixBoard={this.state.gameData.boardMatrix} size={this.state.gameData.tableSize} validCells={this.state.gameData.validCells} isDisable={true} ></Board> 
                        </div>
                        <Player playerDeck = {this.state.gameData.players[this.state.myIndex].deck} isDisable={true}></Player>
                    </div>
                    <div className="left">
                        <button className="button" onClick={this.handleBringTileClick} disabled={true} >Give Me Tile!</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <div className="form_style">
                        <ChatContainer ></ChatContainer>
                    </div>
                    <div className="center">
                         <div className="scroll">
                            <Board matrixBoard={this.state.gameData.boardMatrix} size={this.state.gameData.tableSize} validCells={this.state.gameData.validCells} isDisable={this.state.gameData.currentTurn==this.props.myName?false:true} ></Board> 
                        </div>  
                        <Player playerDeck = {this.state.gameData.players[this.state.myIndex].deck} isDisable={this.state.gameData.currentTurn==this.props.myName?false:true}></Player>
                        <Statistics player={this.state.gameData.players[this.state.myIndex]} startTime={this.state.gameData.startTime} ></Statistics>
                    </div>
                    <div className="left">
                        <button className="button" onClick={this.handleBringTileClick} disabled={this.state.gameData.currentTurn==this.props.myName?false:true} >Give Me Tile!</button>
                    </div>
                    <div className="right">
                        <table>
                            <tbody>
                                {this.state.gameData.players.map((value)=>(
                                    <tr key={value.name}>
                                        <td className={value.name==this.state.gameData.currentTurn? "blink": "none"}>
                                            {value.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
                                                       
        }
    }


}
