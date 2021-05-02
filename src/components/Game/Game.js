import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardGroup } from 'reactstrap'
import MyCards from './MyCards'
import PlayersAndCards from './PlayersAndCards'
import GameHeader from './GameHeader'
import Calling from './Calling'
import Buying from './Buying'
import SelectSuit from './SelectSuit'
import GameOver from './GameOver'

import WebsocketManager from './WebsocketManager'
import AutoActionManager from './AutoActionManager'

const Game = () => {

    const game = useSelector(state => state.game.game)

    return (
        <div>

            { !!game.id && game.status !== "FINISHED" ?

                <CardGroup>

                    <AutoActionManager />
                    <WebsocketManager />

                    <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>

                        <GameHeader />

                        <PlayersAndCards />

                        <MyCards />

                        {/* Calling  */}

                        <Calling />

                        {/* BUYING  */}

                        <Buying />

                        {/* CALLED */}
                        <SelectSuit />

                    </Card>
                </CardGroup>
                : null}


            {/* FINISHED  */}
            { game.status === "FINISHED" ?
                <GameOver />
                : null}
        </div>
    )
}

export default Game;
