import React, { useCallback, useMemo } from "react"
import VictoryIcon from "@mui/icons-material/EmojiEventsTwoTone"
import { getGame, getIsGameActive } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"
import { Player } from "model/Player"
import { Box, Grid, Typography } from "@mui/material"

interface LeaderboardItem {
    previousCard?: string
    score: number
    rings: number
    winner: boolean
    cardsBought: number
    name: string
    picture: string
}

const SinglesLeaderboard = () => {
    const game = useAppSelector(getGame)
    const isGameActive = useAppSelector(getIsGameActive)
    const playerProfiles = useAppSelector(getPlayerProfiles)

    const previousHand = useMemo(() => {
        if (game.round)
            return game.round.completedHands[
                game.round.completedHands.length - 1
            ]
    }, [game])

    const getProfile = useCallback(
        (player: Player) =>
            playerProfiles.find(p => p.id === player.id, [playerProfiles]),
        [playerProfiles],
    )

    const leaderboardData = useMemo<LeaderboardItem[]>(() => {
        const leaderboardData: LeaderboardItem[] = []

        game.players.forEach(player => {
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
                    ? previousHand.playedCards.find(
                          p => p.playerId === profile.id,
                      )?.card
                    : undefined,
                rings: player.rings,
                winner: player.winner,
            })
        })
        return leaderboardData.sort((a, b) => b.score - a.score)
    }, [playerProfiles, game, getProfile, previousHand])

    if (
        !game ||
        !game.status ||
        !playerProfiles ||
        playerProfiles.length === 0
    ) {
        return null
    }

    return (
        <Box>
            {leaderboardData.map((item, index) => (
                <Grid container alignItems="center" key={item.name}>
                    <Grid item xs={4} sx={{ textAlign: "left" }}>
                        <img
                            alt={item.name}
                            src={item.picture}
                            className="avatar"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Typography sx={{ textAlign: "center" }}>
                            Score({item.score}) Rings({item.rings})
                        </Typography>

                        {isGameActive && (
                            <Typography sx={{ textAlign: "center" }}>
                                Cards Bought({item.cardsBought})
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                        {item.winner ? <VictoryIcon /> : null}
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
