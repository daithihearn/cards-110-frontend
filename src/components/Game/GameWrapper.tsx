import { Card, CardGroup } from "reactstrap"
import MyCards from "./MyCards"
import PlayersAndCards from "./PlayersAndCards"

import Calling from "./Calling"
import Buying from "./Buying"
import SelectSuit from "./SelectSuit"
import WebsocketManager from "./WebsocketManager"

import { useAppSelector } from "../../caches/hooks"
import {
    getIamSpectator,
    getIsRoundBuying,
    getIsRoundCalling,
} from "../../caches/GameSlice"

const GameWrapper = () => {
    const iamSpectator = useAppSelector(getIamSpectator)
    const isBuying = useAppSelector(getIsRoundBuying)
    const isCalling = useAppSelector(getIsRoundCalling)

    return (
        <CardGroup>
            <WebsocketManager />

            <Card className="p-6" inverse>
                <PlayersAndCards />

                {!iamSpectator ? <MyCards /> : null}
                {!iamSpectator && isCalling ? <Calling /> : null}
                {!iamSpectator && isBuying ? <Buying /> : null}
                {!iamSpectator ? <SelectSuit /> : null}
            </Card>
        </CardGroup>
    )
}

export default GameWrapper
