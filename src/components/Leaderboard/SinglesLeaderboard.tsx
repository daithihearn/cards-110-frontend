import React, { useCallback, useMemo } from "react"
import VictoryIcon from "@mui/icons-material/EmojiEventsTwoTone"
import { Player } from "model/Player"
import { Box, Grid, Typography } from "@mui/material"
import { CardName } from "model/Cards"
import { useProfiles } from "components/Hooks/useProfiles"
import { useAppSelector } from "caches/hooks"
import { getGamePlayers, getIsGameActive, getRound } from "caches/GameSlice"

interface LeaderboardItem {
    previousCard?: CardName
    score: number
    rings: number
    winner: boolean
    cardsBought: number
    name: string
    picture: string
}

const SinglesLeaderboard = () => {
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

    const leaderboardData = useMemo<LeaderboardItem[]>(() => {
        const leaderboardData: LeaderboardItem[] = []

        players.forEach(player => {
            const profile = getProfile(player)
            if (!profile) {
                return null
            }
            leaderboardData.push({
                picture: profile.picture,
                name: profile.name,
                score: player.score,
                cardsBought: player.cardsBought || 0,
                previousCard: previousHand
                    ? previousHand?.playedCards?.find(
                          p => p.playerId === profile.id,
                      )?.card
                    : undefined,
                rings: player.rings,
                winner: player.winner,
            })
        })
        return leaderboardData.sort((a, b) => b.score - a.score)
    }, [allProfiles, players, getProfile, previousHand])

    return (
        <Box>
            {leaderboardData.map(item => (
                <Grid
                    container
                    alignItems="center"
                    key={item.name}
                    sx={{ minWidth: "300px" }}>
                    <Grid item xs={4} sx={{ textAlign: "left" }}>
                        <img
                            alt={item.name}
                            src={item.picture}
                            className="avatar"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Typography sx={{ textAlign: "center" }}>
                            Score({item.score})
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>
                            Rings({item.rings})
                        </Typography>

                        {isGameActive && (
                            <Typography sx={{ textAlign: "center" }}>
                                Bought({item.cardsBought})
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                        {item.winner ? <VictoryIcon fontSize="large" /> : null}
                        {isGameActive && item.previousCard ? (
                            <img
                                alt={item.previousCard}
                                src={`/cards/thumbnails/${item.previousCard}.png`}
                                className="thumbnail-size-small"
                            />
                        ) : null}
                    </Grid>
                </Grid>
            ))}
        </Box>
    )
}

export default SinglesLeaderboard
