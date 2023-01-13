import { useMemo } from "react"
import { Row, CardBody, Container } from "reactstrap"
import { getGamePlayers } from "../../caches/GameSlice"
import { useAppSelector } from "../../caches/hooks"
import { Player } from "../../model/Player"
import PlayerCard from "./PlayerCard"

const compareSeat = (a: Player, b: Player) => {
  if (a.seatNumber > b.seatNumber) return 1
  if (a.seatNumber < b.seatNumber) return -1
  return 0
}

const PlayersAndCards = () => {
  const players = useAppSelector(getGamePlayers)

  const sortedPlayers = useMemo(() => [...players].sort(compareSeat), [players])

  return (
    <CardBody className="cardArea">
      <Container>
        <Row>
          {sortedPlayers.map((player) => (
            <PlayerCard key={`playercard_${player.id}`} player={player} />
          ))}
        </Row>
      </Container>
    </CardBody>
  )
}

export default PlayersAndCards
