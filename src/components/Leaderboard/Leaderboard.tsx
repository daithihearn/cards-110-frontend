import SinglesLeaderboard from "./SinglesLeaderboard"
import DoublesLeaderboard from "./DoublesLeaderboard"
import { useAppSelector } from "caches/hooks"
import { getIsDoublesGame } from "caches/GameSlice"

const Leaderboard = () => {
    const isDoublesGame = useAppSelector(getIsDoublesGame)

    if (isDoublesGame) return <DoublesLeaderboard />

    return <SinglesLeaderboard />
}

export default Leaderboard
