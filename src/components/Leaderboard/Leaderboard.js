import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import SinglesLeaderboard from './SinglesLeaderboard';
import DoublesLeaderboard from './DoublesLeaderboard';

const compareScore = (a, b) => {
    let comparison = 0;
    if (b.score > a.score) {
        comparison = 1;
    } else if (b.score < a.score) {
        comparison = -1;
    }
    return comparison;
}

class Leaderboard extends Component {
    
    render() {

        if (this.props.playerProfiles.length === 6) {
            return (
                <DoublesLeaderboard playerProfiles={this.props.playerProfiles} players={this.props.players} currentHand={this.props.currentHand} previousHand={this.props.previousHand} gameOver={this.props.gameOver}/>
            );
        }

        return (
            <SinglesLeaderboard playerProfiles={this.props.playerProfiles} players={this.props.players} currentHand={this.props.currentHand} previousHand={this.props.previousHand} gameOver={this.props.gameOver}/>
        );
    }
}

export default Leaderboard;