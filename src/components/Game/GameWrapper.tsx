import { Card, CardGroup } from "reactstrap"
import MyCards from "./MyCards"
import PlayersAndCards from "./PlayersAndCards"

import WebsocketManager from "./WebsocketManager"

import { useAppSelector } from "caches/hooks"
import { getIamSpectator } from "caches/GameSlice"
import ActionsWrapper from "./Actions/ActionsWrapper"

const GameWrapper = () => {
    const iamSpectator = useAppSelector(getIamSpectator)

    return (
        <CardGroup>
            <WebsocketManager />

            <Card className="p-6 gameContainer" inverse>
                <PlayersAndCards />

                {!iamSpectator ? <ActionsWrapper /> : null}
                {!iamSpectator ? <MyCards /> : null}
            </Card>
        </CardGroup>
    )
}

export default GameWrapper
