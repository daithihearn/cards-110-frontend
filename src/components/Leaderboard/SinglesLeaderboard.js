import React from 'react'
import DataTable from 'react-data-table-component'

import { useSelector } from 'react-redux'

const SinglesLeaderboard = () => {

    const players = useSelector(state => state.game.players)
    const game = useSelector(state => state.game.game)
    const previousHand = game.round.completedHands[game.round.completedHands.length - 1]
    const gameOver = game.status === "FINISHED"

    const columns = [
        {
            name: 'Avatar',
            cell: row => <img alt="Image Preview" src={row.picture} className="avatar" />
        },
        { name: 'Player', selector: 'name', sortable: true },
        { name: 'Score', selector: 'score', sortable: true, center: true },
        { name: 'Bought', selector: 'cardsBought', sortable: true, center: true, omit: gameOver },
        {
            cell: row => <img alt={row.previousCard} src={"/cards/thumbnails/" + row.previousCard + ".png"} className="thumbnail_size_small cardNotSelected" />,
            center: true,
            omit: gameOver || !previousHand
        }
    ]

    const processLeaderboardData = () => {
        const leaderboardData = []
        game.playerProfiles.forEach(profile => {
            const player = players.find(p => p.id === profile.id)
            leaderboardData.push(
                {
                    picture: player.picture,
                    name: player.name,
                    score: profile.score,
                    cardsBought: !!profile.cardsBought ? profile.cardsBought : "-",
                    previousCard: !!previousHand ? previousHand.playedCards[profile.id] : null
                }
            )
        })
        return leaderboardData
    } 

    return (
        <React.Fragment>
            <DataTable noHeader theme="solarized"
                data={processLeaderboardData()} columns={columns}
                highlightOnHover defaultSortField="Score" />
        </React.Fragment>
    )
}

export default SinglesLeaderboard