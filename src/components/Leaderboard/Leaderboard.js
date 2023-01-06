import SinglesLeaderboard from "./SinglesLeaderboard"
import DoublesLeaderboard from "./DoublesLeaderboard"
import { doPlayersMatchProfiles } from "../../constants"

const Leaderboard = (props) => {
  const players = props.players
  const game = props.game
  if (
    !game ||
    !game.status ||
    !players ||
    players.length === 0 ||
    !doPlayersMatchProfiles(players, game.playerProfiles)
  ) {
    return null
  }

  if (players.length === 6) {
    return <DoublesLeaderboard game={game} players={players} />
  }
  return <SinglesLeaderboard game={game} players={players} />
}

export default Leaderboard
