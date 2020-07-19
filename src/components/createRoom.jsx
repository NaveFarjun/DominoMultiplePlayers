import React from 'react';

export default class CreateRoom extends React.Component{
    constructor(args) {
        super(...args);
        
        this.state = {
            content: []
        };        
    }
    render(){
        return(
            <div className="main">
                <h1>Welcome to domino!!</h1>
                <h3>Create new domino game</h3>
                <form onSubmit={this.props.handleRoomCreation}>
                    <div className="createNewRoom-Name">
                            <label className="create-room-form-label">Room Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <input className="gamename-input" name="gameName" />
                            <br /><br />
                    </div>
                    <div className="createNewRoom-numOfPlayers">
                        <label className="create-room-form-label">Total Players:&nbsp;</label>
                        <input className="totalPlayers-input" name="totalPlayers" />
                        <br /><br />
                    </div>
                    <input className="submit-btn btn" type="submit" value="create Room"/>
                </form>
                <div>{this.props.errMessage}</div>
            </div>
        );
    }
    

}