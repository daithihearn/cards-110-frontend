import { Card, CardGroup } from "reactstrap"
import MyCards from "./MyCards"
import PlayersAndCards from "./PlayersAndCards"
import GameHeader from "./GameHeader"
import Calling from "./Calling"
import Buying from "./Buying"
import SelectSuit from "./SelectSuit"
import AutoActionManager from "./AutoActionManager"
import WebsocketManager from "./WebsocketManager"

import { useAppSelector } from "../../caches/hooks"
import { getGame } from "../../caches/GameSlice"

const GameWrapper = () => {
  const game = useAppSelector(getGame)

  return (
    <CardGroup>
      <WebsocketManager />
      <AutoActionManager />

      <Card
        className="p-6 tableCloth"
        inverse
        style={{ backgroundColor: "#333", borderColor: "#333" }}
      >
        <GameHeader />
        <PlayersAndCards />

        {!game.iamSpectator ? <MyCards /> : null}
        {!game.iamSpectator ? <Calling /> : null}
        {!game.iamSpectator ? <Buying /> : null}
        {!game.iamSpectator ? <SelectSuit /> : null}
      </Card>
    </CardGroup>
  )
}

export default GameWrapper
