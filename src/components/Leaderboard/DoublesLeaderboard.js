import React from 'react'
import DataTable from 'react-data-table-component'
import {compareScore, compareTeamIds, doPlayersMatchProfiles} from '../../constants'

const DoublesLeaderboard = (props) => {

    const players = props.players
    const game = props.game
    
    if (!game || !game.status || !players || players.length === 0 || !doPlayersMatchProfiles(players, game.playerProfiles)) {
        return null
    }
    const previousHand = game.round.completedHands[game.round.completedHands.length - 1]
    const gameOver = game.status === "FINISHED"

    const columns = [
        {
            name: 'Player 1',
            cell: row => <div><img alt="Image Preview" src={players.find(p => p.id === row.player1.id).picture} className="avatar" />

                {!gameOver && !!previousHand ?
                    <div>
                        {!!previousHand && !!previousHand.playedCards[row.player1.id] ?
                            <img alt={previousHand.playedCards[row.player1.id]} src={"/cards/thumbnails/" + previousHand.playedCards[row.player1.id] + ".png"} className="thumbnail_size_small cardNotSelected" /> : null}
                    </div>
                    : null}

                {!gameOver ?
                    <div>{!!row.player1.cardsBought ? `Bought: ${row.player1.cardsBought}` : ``}</div>
                    : null}
            </div>
        },
        {
            name: 'Player 2',
            cell: row => <div><img alt="Image Preview" src={players.find(p => p.id === row.player2.id).picture} className="avatar" />

                {!gameOver && !!previousHand ?
                    <div>
                        {!!previousHand && !!previousHand.playedCards[row.player2.id] ?
                            <img alt={previousHand.playedCards[row.player2.id]} src={"/cards/thumbnails/" + previousHand.playedCards[row.player2.id] + ".png"} className="thumbnail_size_small cardNotSelected" /> : null}
                    </div>
                    : null}

                {!gameOver ?
                    <div>{!!row.player2.cardsBought ? `Bought: ${row.player2.cardsBought}` : ``}</div>
                    : null}
            </div>
        },
        { name: 'Score', selector: 'score', sortable: true, center: true },
        { name: 'Rings', selector: 'rings', sortable: true, center: true }
    ]

    const buildTeams = () => {
        let ps = game.playerProfiles.sort(compareTeamIds)

        if (!ps) { return null }
        let teams = [
            { id: ps[0].teamId, score: ps[0].score, rings: ps[0].rings, player1: ps[0], player2: ps[1] },
            { id: ps[2].teamId, score: ps[2].score, rings: ps[2].rings, player1: ps[2], player2: ps[3] },
            { id: ps[4].teamId, score: ps[4].score, rings: ps[4].rings, player1: ps[4], player2: ps[5] }
        ]

        return teams.sort(compareScore)
    }

    return (
        <React.Fragment>
            <DataTable noHeader theme="solarized"
                data={buildTeams()} columns={columns}
                highlightOnHover defaultSortField="Score" />
        </React.Fragment>
    )
}

export default DoublesLeaderboard;