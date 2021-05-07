import { Card, CardGroup } from 'reactstrap'
import MyCards from './MyCards'
import PlayersAndCards from './PlayersAndCards'
import GameHeader from './GameHeader'
import Calling from './Calling'
import Buying from './Buying'
import SelectSuit from './SelectSuit'
import AutoActionManager from './AutoActionManager'
import WebsocketManager from './WebsocketManager'

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
            <WebsocketManager game={game} players={players} />

            <AutoActionManager game={game} orderedCards={orderedCards}/>

            <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <GameHeader game={game} players={players}/>
                <PlayersAndCards game={game} players={players}/>
                { !game.iamSpectator ? <MyCards game={game} orderedCards={orderedCards}/> : null }
                { !game.iamSpectator ? <Calling game={game}/> : null }
                { !game.iamSpectator ? <Buying game={game} orderedCards={orderedCards}/> : null }
                { !game.iamSpectator ? <SelectSuit game={game} orderedCards={orderedCards}/> : null }
            </Card>
        </CardGroup>
    )
}

export default GameWrapper