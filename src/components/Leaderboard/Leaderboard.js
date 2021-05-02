import SinglesLeaderboard from './SinglesLeaderboard'
import DoublesLeaderboard from './DoublesLeaderboard'

import { useSelector } from 'react-redux'

const Leaderboard = () => {

    const numPlayers = useSelector(state => state.game.players.length)

    if (numPlayers === 6) {
        return (<DoublesLeaderboard />)
    }
    return (<SinglesLeaderboard />)
}

export default Leaderboard