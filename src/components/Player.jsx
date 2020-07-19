import React, { Component } from "react";
import Tile from "./Tile.jsx";
class Player extends Component{
    constructor(props){
        super(props);
        let initDeck=[null];
    }
    render()
    {
        let myTiles=this.props.playerDeck.map(value=> <Tile key={value.First*10+value.Second} 
            position="FirstLeft"
            First={value.First}
             Second={value.Second}
              isDisable={this.props.isDisable}
              className="noMargin"></Tile>);
        return (
        <div>{myTiles}</div>
        );
    }    
}
export default Player 