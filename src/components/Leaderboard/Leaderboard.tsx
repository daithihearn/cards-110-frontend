import SinglesLeaderboard from "./SinglesLeaderboard"
import DoublesLeaderboard from "./DoublesLeaderboard"
import { useAppSelector } from "../../caches/hooks"
import { isDoublesGame } from "../../caches/GameSlice"

const Leaderboard = () => {
  const isDoubles = useAppSelector(isDoublesGame)

  if (isDoubles) return <DoublesLeaderboard />

  return <SinglesLeaderboard />
}

export default Leaderboard
