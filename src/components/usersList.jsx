import React, { Component } from 'react'

class UserList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            content:[],
        }
        this.getOnlineUsers=this.getOnlineUsers.bind(this);
    }
    componentDidMount() {
        this.getOnlineUsers();
    }

    componentWillUnmount() {
        if (this.timeoutId1) {
            clearTimeout(this.timeoutId1);
        }
        this.isCancelled = true;
    }
    render(){
        return(
            <div className="scroll2">
                <table>
                    <tbody>
                        {this.state.content.map((line, index) => (
                            <tr key={line} id={line}>
                                <td>
                                    {line}
                                </td>
                            </tr>   
                        ))} 
                    </tbody>
                </table>
            </div>
        )
    }
  
    getOnlineUsers(){
        return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId1 = setTimeout(this.getOnlineUsers, 200);
            return response.json();            
        })
        .then(content => {
            var newContent=content;
            this.setState({content: newContent});
        })
        .catch(err => {throw err});
    }
   
}
export default UserList;
