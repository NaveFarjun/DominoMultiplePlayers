import React, { Component } from 'react'



class Statistics extends Component{
    constructor(props) {
        super(props);
        let startTime = new Date().getTime();
        this.state = {
            timer:0,
        }

        //this.props.gameState.currentPlayer.startTurnTimer = this.props.gameStartTime;

    }

    getGameDuration(){
        let currentTime = new Date().getTime();
        this.setState({timer:( currentTime - this.props.startTime)})

    }

    componentDidMount() {

        this.interval= setInterval(() => this.getGameDuration(), 10);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    miliSecondsToTimeString(timeInMiliSeconds) {
        var timeInSeconds = Math.round(timeInMiliSeconds / 1000);
        var seconds = Math.floor(timeInSeconds % 60)
        var minutes = Math.floor((timeInSeconds /60));
        var hours = Math.floor(minutes / 60);
        minutes = minutes%60;
        return hours + ":" + minutes + ":" + seconds
    }
    render(){
        return (
            
            <table className="StatsBar">
                <tbody>
                <tr>
            <td className="statusBarTd">Game Duration: {this.miliSecondsToTimeString(this.state.timer)}</td>
            <td className="statusBarTd">Number Of Turns: {this.props.player.numOfTurns}</td>
            <td className="statusBarTd">Avg action time: {this.miliSecondsToTimeString(this.props.player.avgActionTime)}</td>
            <td className="statusBarTd">Number of tiles from cash: {this.props.player.howMantTimesTookFromCash}</td>
            <td className="statusBarTd">Player score: {this.props.player.score}</td>
            </tr>
            </tbody>
            </table>
            
        );
    }
}
export default Statistics;



 
