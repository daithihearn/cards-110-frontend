import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};


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

        const { children, ...attributes } = this.props;
    
        return (
          <React.Fragment>
            <Table className="leaderboardTable" dark borderless striped responsive>
                <thead>
                <tr>
                    <th align="left">Avatar</th>
                    <th align="left">Player</th>
                    <th>Score</th>
                    
                    { !this.props.gameOver ?<th>Bought</th>: null}
                    { !this.props.gameOver && !!this.props.previousHand ?<th>Previous</th>: null}
                    
                </tr>
                </thead>
                <tbody>
                { this.props.playerProfiles.sort(compareScore).map((playerProfile, idx) => 
                <tr key={`players_${idx}`}>
                    <td>
                    <img alt="Image Preview" src={this.props.players.find(p => p.id === playerProfile.id).picture} className="avatar" />
                    </td>
                    <td>
                    { this.props.players.find(p => p.id === playerProfile.id).name }
                    </td>
                    <td>
                    {playerProfile.score}
                    </td>
                    { !this.props.gameOver ?
                        <td>
                            { !!playerProfile.cardsBought ? playerProfile.cardsBought: ""}
                        </td>
                    : null}
                    { !this.props.gameOver && !!this.props.previousHand ?
                        <td>
                            {!!this.props.previousHand && !!this.props.previousHand.playedCards[playerProfile.id] ?
                            <img alt={this.props.previousHand.playedCards[playerProfile.id]} src={"/cards/thumbnails/" + this.props.previousHand.playedCards[playerProfile.id] + ".png"} className="thumbnail_size_small cardNotSelected"  /> : null }
                        </td>
                    : null}
                </tr>
                )}
                </tbody>
            </Table>
          </React.Fragment>
        );
    }
}

Leaderboard.propTypes = propTypes;
Leaderboard.defaultProps = defaultProps;

export default Leaderboard;