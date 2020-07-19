import React, { Component } from "react";


class  Tile extends Component{
    constructor(props){
        super(props);
        
        this.handleClick=this.handleClick.bind(this);
    }
    handleClick(){
        if(!this.props.isDisable){
           
            this.handleTileClick();
            this.calculateLeagalMoves();
        }
    }
    calculateLeagalMoves(){
    
    }
    handleTileClick() {
		fetch('/game/TileClick', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ First:this.props.First, Second:this.props.Second }),
			credentials: 'include'
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState(this.state);
				}
			})
	}
    render(){
         var class_name=this.props.position;
    return(
        <img className={class_name} src={require('./domino tiles/'+this.props.First+this.props.Second+'.png')} width="65px" height="57px" onClick={this.handleClick}></img>
    );
    }
}
export default Tile;
