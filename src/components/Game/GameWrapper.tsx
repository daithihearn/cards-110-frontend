import { Card, CardGroup } from "reactstrap"
import MyCards from "./MyCards"
import PlayersAndCards from "./PlayersAndCards"

import Calling from "./Calling"
import Buying from "./Buying"
import SelectSuit from "./SelectSuit"
import AutoActionManager from "./AutoActionManager"
import WebsocketManager from "./WebsocketManager"

import { useAppSelector } from "../../caches/hooks"
import { getIamSpectator } from "../../caches/GameSlice"

const GameWrapper = () => {
    const iamSpectator = useAppSelector(getIamSpectator)

    return (
        <CardGroup>
            <WebsocketManager />
            <AutoActionManager />

            <Card
                className="p-6 tableCloth"
                inverse
                style={{ backgroundColor: "#333", borderColor: "#333" }}>
                <PlayersAndCards />

                {!iamSpectator ? <MyCards /> : null}
                {!iamSpectator ? <Calling /> : null}
                {!iamSpectator ? <Buying /> : null}
                {!iamSpectator ? <SelectSuit /> : null}
            </Card>
        </CardGroup>
    )
}

export default GameWrapper
