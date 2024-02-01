import { useMemo } from "react"
import { Grid, CardContent } from "@mui/material"
import { Player, PlayerProfile } from "model/Player"
import PlayerCard from "./PlayerCard"
import { useProfiles } from "components/Hooks/useProfiles"
import { useAppSelector } from "caches/hooks"
import { getGameId, getGamePlayers } from "caches/GameSlice"

const compareSeat = (a: Player, b: Player) => {
    if (a.seatNumber > b.seatNumber) return 1
    if (a.seatNumber < b.seatNumber) return -1
    return 0
}

interface PP {
    player: Player
    profile: PlayerProfile
}

const PlayersAndCards = () => {
    const gameId = useAppSelector(getGameId)
    const players = useAppSelector(getGamePlayers)
    const { allProfiles } = useProfiles()

    const playerProfiles = useMemo(() => {
        const sorted = [...players].sort(compareSeat)
        const playerProfiles: PP[] = []

        sorted.forEach((player, index) => {
            const profile = allProfiles.find(p => p.id === player.id)
            if (profile !== undefined) {
                playerProfiles.push({ player, profile })
            }
        })
        return playerProfiles
    }, [players, allProfiles])

    // Calculate xs based on number of players
    // 2 players: xs=6
    // 3 players: xs=4
    // 4 players: xs=3
    // 5 players: xs=2
    // 6 players: xs=2
    const xs = useMemo(() => {
        switch (playerProfiles.length) {
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
    }, [playerProfiles.length])

    return (
        <CardContent className="card-root">
            <Grid container justifyContent="space-between">
                {playerProfiles.map((pp, index) => (
                    <Grid
                        item
                        key={`playerCard_${gameId}_${pp.player.id}`}
                        xs={xs}>
                        <PlayerCard
                            player={pp.player}
                            profile={pp.profile}
                            className={
                                playerProfiles.length === 6
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
