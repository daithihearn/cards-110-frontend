import { Card, CardGroup } from 'reactstrap'
import MyCards from './MyCards'
import PlayersAndCards from './PlayersAndCards'
import GameHeader from './GameHeader'
import Calling from './Calling'
import Buying from './Buying'
import SelectSuit from './SelectSuit'
import AutoActionManager from './AutoActionManager'

import { useSelector } from 'react-redux'

const GameWrapper = () => {

    const game = useSelector(state => state.game.game)
    const players = useSelector(state => state.game.players)
    const orderedCards = useSelector(state => state.game.orderedCards)
    if (!game || !game.status || game.status === "FINISHED" || !players || players.length === 0) {
        return null
    }

    return (
        <CardGroup>

            <AutoActionManager game={game} orderedCards={orderedCards}/>

            <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <GameHeader game={game} players={players}/>
                <PlayersAndCards game={game} players={players}/>
                <MyCards game={game} orderedCards={orderedCards}/>
                <Calling game={game}/>
                <Buying game={game} orderedCards={orderedCards}/>
                <SelectSuit game={game} orderedCards={orderedCards}/>
            </Card>
        </CardGroup>
    )
}

export default GameWrapper