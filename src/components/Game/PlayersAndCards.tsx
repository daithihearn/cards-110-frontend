import { useMemo } from "react"
import { Grid, CardContent, Container } from "@mui/material"
import { getGamePlayers } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { Player } from "model/Player"
import PlayerCard from "./PlayerCard"

const compareSeat = (a: Player, b: Player) => {
    if (a.seatNumber > b.seatNumber) return 1
    if (a.seatNumber < b.seatNumber) return -1
    return 0
}

const PlayersAndCards = () => {
    const players = useAppSelector(getGamePlayers)

    const sortedPlayers = useMemo(
        () => [...players].sort(compareSeat),
        [players],
    )

    // Calculate xs based on number of players
    // 2 players: xs=6
    // 3 players: xs=4
    // 4 players: xs=3
    // 5 players: xs=2
    // 6 players: xs=2
    const xs = useMemo(() => {
        switch (sortedPlayers.length) {
            case 2:
                return 6
            case 3:
                return 4
            case 4:
                return 3
            case 5:
            case 6:
                return 2
            default:
                return 12
        }
    }, [sortedPlayers.length])

    return (
        <CardContent className="card-root">
            <Grid container justifyContent="space-between">
                {sortedPlayers.map((player, index) => (
                    <Grid item key={`playercard_${player.id}`} xs={xs}>
                        <PlayerCard
                            player={player}
                            className={
                                sortedPlayers.length === 6
                                    ? `image-team${(index % 3) + 1}-filter`
                                    : ""
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </CardContent>
    )
}

export default PlayersAndCards
