import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import CreateRoom from './createRoom.jsx';
import GameZone from './GameZone.jsx';
import Rooms from './rooms.jsx'
import UserList from './usersList.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            showen: 'login',
            currentUser: {
                name: '',
                errMessage: '',
                selectedRoom: null,
                insideGame: null

            }
        };
        
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.handleRoomCreation=this.handleRoomCreation.bind(this);
        this.handleSelectingRoom=this.handleSelectingRoom.bind(this);
        this.handleEnteringRoom=this.handleEnteringRoom.bind(this);
        this.handleLeavingRoom=this.handleLeavingRoom.bind(this);
        this.handleEnteringGame=this.handleEnteringGame.bind(this);
        this.returnToRoomsScreen=this.returnToRoomsScreen.bind(this);
        this.handleRoomDelete=this.handleRoomDelete.bind(this);
        this.getUserName();
    }
    
    render() {        
        if (this.state.showen=='login') {
            return (<LoginModal loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        }
        if(this.state.showen=='chooseOrCreateRoom')
        {
            return (
                <div>
                    <button className="logoutBtn" onClick={this.logoutHandler}>logout</button>
                    <span>
                    <CreateRoom  handleRoomCreation={this.handleRoomCreation}  errMessage={this.state.errMessage}></CreateRoom>
                    <div className="right2">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Online Users:
                        <UserList ></UserList>
                    </div>
                    </span>
                    <Rooms selectedRoom={this.state.selectedRoom} selctingRoomHandler={this.handleSelectingRoom} handleRoomDeleting={this.handleRoomDelete} enteringRoomHandler={this.handleEnteringRoom} insideGame={this.state.insideGame} leavingRoomHandler={this.handleLeavingRoom} 
                    enteringGameHandler={this.handleEnteringGame}></Rooms>
                </div>);
        }
        if(this.state.showen=='gameZone'){
            return(
            <GameZone gameNum={this.state.insideGame} myName={this.state.currentUser.name} returnToRooms={this.returnToRoomsScreen}></GameZone>);
        }
        //return this.renderChatRoom();
    }
    returnToRoomsScreen(){
        this.setState({showen: 'chooseOrCreateRoom',insideGame: null, selectedRoom:null});

    }

    handleSuccessedLogin() {
        this.setState(()=>({showen:'chooseOrCreateRoom'}), this.getUserName);        
    }

    handleLoginError() {
        console.error('login failed');
        this.setState(()=>({showLogin:true}));
    }

    renderChatRoom() {
        return(
            <div className="chat-base-container">
                <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <button className="logout btn" onClick={this.logoutHandler}>Logout</button>
                </div>
                <ChatContaier />                
            </div>
        )
    }

    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser:userInfo}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }
    fetchRoomsInfo() {        
        return fetch('/rooms/allRoomsInfo',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }
    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            this.setState(()=>({currentUser: {name:''}, showen: 'login'}));
        })
    }
    handleRoomCreation(e){
        e.preventDefault();
        const gameTitle = e.target.elements.gameName.value;
        const totalPlayers = e.target.elements.totalPlayers.value;
        fetch('/rooms/createGame', {method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
         body: JSON.stringify({
            gameTitle: gameTitle,
            totalPlayers: totalPlayers,
        }), credentials: 'include'})
        .then(response=>{
            if (response.status === 403 || response.status === 200) {
                return response.json();
            }
        })
        .then((res) => {
            if (res.message) {
                this.setState({ errMessage: res.message, shown:'chooseOrCreateRoom' });
            } else {
                this.setState({ errMessage: '', shown:'chooseOrCreateRoom'});
            }
        });
    }
    handleRoomDelete(index){
        fetch('/rooms/removeRoom',{method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({roomNum:index,}),credentials:'include'})
        .then(response=>{
            if (response.status === 403 || response.status === 200) {
                return response.json();
            }
        })
        .then((res) => {
            if (res.message) {
                this.setState({ errMessage: res.message, shown:'chooseOrCreateRoom' });
            } else {
                this.setState({ errMessage: '', shown:'chooseOrCreateRoom'});
                this.setState({insideGame: null, selectedRoom: null})
            }

        });

    }
    handleSelectingRoom(index){
        this.setState({selectedRoom: index});
    }
    handleEnteringRoom(index){
        fetch('/rooms/enteringRoom', {method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
         body: JSON.stringify({
            gameNum: index,
            playerName: this.state.currentUser.name,
        }), credentials: 'include'})
        .then(response=>{
            if (response.status === 403 || response.status === 200) {
                return response.json();
            }
        })
        .then((res)=>{
            if (res.message) {
                this.setState({ errMessage: res.message, showen:'chooseOrCreateRoom' });
            } else {
                this.setState({ errMessage: '', showen:'chooseOrCreateRoom'});
                this.setState({insideGame: index+1})
            }
        }
        )
    }
    handleLeavingRoom(index){
        //fetch('/rooms/leavingRoom', {method: 'POST', body: index, credentials: 'include'})
        fetch('/rooms/leavingRoom', {method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
         body: JSON.stringify({
            gameNum: index,
            playerName: this.state.currentUser.name,
        }), credentials: 'include'})
        .then(response=>{
            if (response.status === 403 || response.status === 200) {
                return response.json();
            }
        })
        .then((res)=>{
            if (res.message) {
                this.setState({ errMessage: res.message, showen:'chooseOrCreateRoom' });
            } else {
                this.setState({ errMessage: '', showen:'chooseOrCreateRoom'});
                this.setState({insideGame: null, selectedRoom: null})
            }
        }
        )
    }
    handleEnteringGame(){   //function that handling with actual entering to game zone.
        this.setState({showen: 'gameZone'})
    }

}