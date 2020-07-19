import React from 'react';
import ReactDOM from 'react-dom';

export default class Rooms extends React.Component {
    constructor(args) {
        super(...args);        

        this.state = {
            content:[] ,
        };
        this.getAllRoomsInfo=this.getAllRoomsInfo.bind(this);
    }
    componentDidMount() {
        this.getAllRoomsInfo();
    }

    componentWillUnmount() {
        if (this.timeoutId1) {
            clearTimeout(this.timeoutId1);
        }
        this.isCancelled = true;
    }
    
    getAllRoomsInfo(){
        return fetch('/rooms/roomsInfo', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId1 = setTimeout(this.getAllRoomsInfo, 200);
            return response.json();            
        })
        .then(content => {
            var newContent=content;
            this.setState({content: newContent});
        })
        .catch(err => {throw err});
    }
    render(){
        return(
            <div>
                <table>
                <thead>
                <tr>
                    <td className={(this.props.selectedRoom==null) ? "hideJoinRoom": "showEnterRoom"}>
                        selected room: {this.props.selectedRoom} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button className={this.props.insideGame!=null? "hideJoinBtnRoom": "showJoinBtnRoom"} onClick={() => this.props.enteringRoomHandler(this.props.selectedRoom)}>join</button>
                        <button className={this.props.insideGame!=null? "hideDelBtnRoom": "showDelBtnRoom"} onClick={() => this.props.handleRoomDeleting(this.props.selectedRoom)}>delete</button>
                        <button className={this.props.insideGame==null? "hideLeaveRoom": "showLeaveRoom"} onClick={() => this.props.leavingRoomHandler(this.props.selectedRoom)}>Leave</button>
                        <button onClick={this.props.enteringGameHandler} className={this.props.insideGame? "showPlayBtn":"hidePlayBtn"}>Play!</button>
                    </td>
                </tr>
                </thead>
                </table>
                <h3>Existed Rooms</h3>
                <table>
                    <thead>
                        <tr className="css2">
                            <th>Room Name</th>
                            <th>Creator</th>
                            <th>Total Players</th>
                            <th>Current Num of Players</th>
                            <th>Started?</th>
                            <th>Enter Button</th>
                        </tr>
                    </thead>
                    <tbody id="roomslist">
                        {this.state.content.map((line, index) => (
                            <tr key={line.roomNum} id={line.roomNum} className="css">
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {line.gameTitle}
                                </td>
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 {line.creator}
                                </td>
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  {line.totalPlayers}
                                </td>
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 {line.onlinePlayers}
                                </td>
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 {line.startGame == true ? 'Yes' : 'No'}
                                </td>
                                <td className="css">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 <button className={this.props.insideGame!=null? "hideChooseRoom":"showChooseRoom"}onClick={() => this.props.selctingRoomHandler(line.roomNum)}>choose</button>
                                </td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
        );
    }
    
}

