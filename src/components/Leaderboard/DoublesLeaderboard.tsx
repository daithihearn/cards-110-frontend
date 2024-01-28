import React, { useCallback, useMemo } from "react"
import VictoryIcon from "@mui/icons-material/EmojiEventsTwoTone"
import { useAppSelector } from "caches/hooks"
import { getGamePlayers, getIsGameActive, getRound } from "caches/GameSlice"
import { compareScore, compareTeamIds } from "utils/PlayerUtils"
import { Player } from "model/Player"
import { Box, Grid, Typography } from "@mui/material"
import { useProfiles } from "components/Hooks/useProfiles"

interface LeaderBoardPlayer {
    cardsBought?: number
    name: string
    picture: string
    previousCard?: string
}

interface DoublesLeaderboardItem {
    teamId: string
    score: number
    rings: number
    player1: LeaderBoardPlayer
    player2: LeaderBoardPlayer
    winner: boolean
}

const DoublesLeaderboard = () => {
    const round = useAppSelector(getRound)
    const players = useAppSelector(getGamePlayers)
    const isGameActive = useAppSelector(getIsGameActive)

    const { allProfiles } = useProfiles()

    const previousHand = useMemo(() => {
        if (round) return round.completedHands[round.completedHands.length - 1]
    }, [round])

    const getProfile = useCallback(
        (player: Player) =>
            allProfiles.find(p => p.id === player.id, [allProfiles]),
        [allProfiles],
    )

    const mapToLeaderboard = useCallback(
        (player: Player): LeaderBoardPlayer => {
            const profile = getProfile(player)
            if (!profile) throw Error("No profile for player")
            const previousCard = previousHand?.playedCards?.find(
                c => c.playerId === player.id,
            )
            return {
                cardsBought: player.cardsBought,
                name: profile.name,
                picture: profile.picture,
                previousCard: previousCard?.card,
            }
        },
        [previousHand],
    )

    const leaderboardData = useMemo<DoublesLeaderboardItem[]>(() => {
        const ps = [...players].sort(compareTeamIds)

        if (!ps) {
            return []
        }
        const items: DoublesLeaderboardItem[] = [
            {
                teamId: ps[0].teamId,
                score: ps[0].score,
                rings: ps[0].rings,
                player1: mapToLeaderboard(ps[0]),
                player2: mapToLeaderboard(ps[1]),
                winner: ps[0].winner,
            },
            {
                teamId: ps[2].teamId,
                score: ps[2].score,
                rings: ps[2].rings,
                player1: mapToLeaderboard(ps[2]),
                player2: mapToLeaderboard(ps[3]),
                winner: ps[2].winner,
            },
            {
                teamId: ps[4].teamId,
                score: ps[4].score,
                rings: ps[4].rings,
                player1: mapToLeaderboard(ps[4]),
                player2: mapToLeaderboard(ps[5]),
                winner: ps[4].winner,
            },
        ]

        return items.sort(compareScore)
    }, [players])

    if (allProfiles.length === 0) {
        return null
    }

    return (
        <Box>
            {leaderboardData.map((item, index) => (
                <Grid
                    container
                    alignItems="center"
                    key={item.teamId}
                    sx={{ minWidth: "300px" }}>
                    <Grid item xs={3} sx={{ textAlign: "center" }}>
                        <img
                            alt={item.player1.name}
                            src={item.player1.picture}
                            className="avatar"
                        />
                        {isGameActive && item.player1.cardsBought && (
                            <Typography sx={{ textAlign: "center" }}>
                                Bought({item.player1.cardsBought})
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "center" }}>
                        <img
                            alt={item.player2.name}
                            src={item.player2.picture}
                            className="avatar"
                        />
                        {isGameActive && item.player2.cardsBought && (
                            <Typography sx={{ textAlign: "center" }}>
                                Bought({item.player2.cardsBought})
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={3}>
                        <Typography sx={{ textAlign: "center" }}>
                            Score({item.score})
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>
                            Rings({item.rings})
                        </Typography>
                    </Grid>

                    <Grid item xs={3} sx={{ textAlign: "right" }}>
                        {item.winner ? <VictoryIcon fontSize="large" /> : null}
                    </Grid>
                </Grid>
            ))}
        </Box>
    )
}

export default DoublesLeaderboard
