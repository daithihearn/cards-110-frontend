import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const compareScore = (a, b) => {
    let comparison = 0;
    if (b.score > a.score) {
        comparison = 1;
    } else if (b.score < a.score) {
        comparison = -1;
    }
    return comparison;
}

const compareTeamIds = (a, b) => {
    let comparison = 0;
    if (b.teamId > a.teamId) {
        comparison = 1;
    } else if (b.teamId < a.teamId) {
        comparison = -1;
    }
    return comparison;
}

const buildTeams = (players, profiles) => {
    let ps = profiles.sort(compareTeamIds);

    let teams = [
        { id: ps[0].teamId, score: ps[0].score, rings: ps[0].rings, player1: ps[0], player2: ps[1] }, 
        { id: ps[2].teamId, score: ps[2].score, rings: ps[2].rings, player1: ps[2], player2: ps[3] }, 
        { id: ps[4].teamId, score: ps[4].score, rings: ps[4].rings, player1: ps[4], player2: ps[5] }
    ];

    return teams.sort(compareScore);
}

class DoublesLeaderboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: buildTeams(this.props.players, this.props.playerProfiles)
        };
    }
    
    render() {
    
        return (
          <React.Fragment>
            <Table className="leaderboardTable" dark borderless striped responsive>
                <thead>
                <tr>
                    <th align="center"></th>
                    <th align="center"></th>
                    <th>Score</th>
                    <th>Rings</th>
                    
                </tr>
                </thead>
                <tbody>
                { this.state.teams.map((team, idx) => 
                <tr key={`teams_${idx}`}>
                    <td align="center">
                    <img alt="Image Preview" src={this.props.players.find(p => p.id === team.player1.id).picture} className="avatar" />

                    { !this.props.gameOver && !!this.props.previousHand ?
                        <div>
                            {!!this.props.previousHand && !!this.props.previousHand.playedCards[team.player1.id] ?
                            <img alt={this.props.previousHand.playedCards[team.player1.id]} src={"/cards/thumbnails/" + this.props.previousHand.playedCards[team.player1.id] + ".png"} className="thumbnail_size_small cardNotSelected"  /> : null }
                        </div>
                    : null}
                    
                    { !this.props.gameOver ?
                        <div>{ !!team.player1.cardsBought ? `Bought: ${team.player1.cardsBought}`: ``}</div>
                    : null}
                    </td>
                    <td align="center">
                    <img alt="Image Preview" src={this.props.players.find(p => p.id === team.player2.id).picture} className="avatar" />

                    { !this.props.gameOver && !!this.props.previousHand ?
                        <div>
                            {!!this.props.previousHand && !!this.props.previousHand.playedCards[team.player2.id] ?
                            <img alt={this.props.previousHand.playedCards[team.player2.id]} src={"/cards/thumbnails/" + this.props.previousHand.playedCards[team.player2.id] + ".png"} className="thumbnail_size_small cardNotSelected"  /> : null }
                        </div>
                    : null}
                    
                    { !this.props.gameOver ?
                        <div>{ !!team.player1.cardsBought ? `Bought: ${team.player2.cardsBought}`: ``}</div>
                    : null}
                    </td>
                    <td>
                    {team.score}
                    </td>
                    <td>
                        {team.rings}
                    </td>
                </tr>
                )}
                </tbody>
            </Table>
          </React.Fragment>
        );
    }
}

export default DoublesLeaderboard;