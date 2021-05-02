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
    if (!game || !game.status || game.status === "FINISHED") {
        return null
    }

    return (
        <CardGroup>

            <AutoActionManager />

            <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <GameHeader />
                <PlayersAndCards />
                <MyCards />
                <Calling />
                <Buying />
                <SelectSuit />
            </Card>
        </CardGroup>
    )
}

export default GameWrapper