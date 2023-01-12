import { useCallback, useMemo } from "react"
import { Row, CardBody, Container } from "reactstrap"
import { getGame } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { Player } from "../../model/Player"
import PlayerCard from "./PlayerCard"

const compareSeat = (a: Player, b: Player) => {
  if (a.seatNumber > b.seatNumber) return 1
  if (a.seatNumber < b.seatNumber) return -1
  return 0
}

const PlayersAndCards = () => {
  const playerProfiles = useAppSelector(getPlayerProfiles)
  const game = useAppSelector(getGame)

  const sortedPlayers = useMemo(
    () => [...game.players].sort(compareSeat),
    [game]
  )

  const getProfile = useCallback(
    (player: Player) =>
      playerProfiles.find((p) => p.id === player.id, [playerProfiles]),
    [playerProfiles]
  )

  return (
    <CardBody className="cardArea">
      <Container>
        <Row>
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={`playercard_${player.id}`}
              player={player}
              profile={getProfile(player)}
            />
          ))}
        </Row>
      </Container>
    </CardBody>
  )
}

export default PlayersAndCards
