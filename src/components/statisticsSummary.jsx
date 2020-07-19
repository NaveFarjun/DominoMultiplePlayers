import React from 'react';
import ReactDOM from 'react-dom';

export default class StatisticsSummary extends React.Component {
    constructor(args) {
        super(...args);
             
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
        return(
            <div id="myModal" className="modal">

           
            <div className="modal-content">
              <div className="modal-header">
                <span className="close" onClick={this.props.returnToRooms}>&times;</span>
                <h2>{this.props.winnerName} won!!!</h2>
              </div>
              <div className="modal-body">
                  <table>
                      <tbody>
                        {this.props.players.map((value)=>(
                            <tr key={value.name}>
                                <td className="namesInTheEndOfGame">{value.name}</td>
                                <td className="main">score:{value.score}</td>
                                <td className="main">took from cash {value.howMantTimesTookFromCash} times</td>
                                <td className="main">avg time for move:{this.miliSecondsToTimeString(value.avgActionTime)}</td>
                                <td className="main">{this.props.winnerName==value.name?"king of domino":""}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
              </div>
              <div className="modal-footer">
                <h2>Game Over!!!</h2>
              </div>
            </div>
          
          </div>
          
        )
    }
}











