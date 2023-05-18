import React, { useCallback, useMemo } from "react"
import VictoryIcon from "@mui/icons-material/EmojiEventsTwoTone"
import { getGame, getIsGameActive } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"
import { Player } from "model/Player"
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Box,
} from "@mui/material"

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
            <List>
                {leaderboardData.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <img
                                alt={item.name}
                                src={item.picture}
                                className="avatar-large"
                            />
                        </ListItemIcon>

                        <ListItemText
                            primary={`Score: ${item.score}`}
                            secondary={`Rings: ${item.rings} Bought: ${item.cardsBought}`}
                            sx={{ textAlign: "center", width: "100px" }}
                        />

                        <ListItemSecondaryAction>
                            {item.winner ? (
                                <VictoryIcon />
                            ) : isGameActive && item.previousCard ? (
                                <img
                                    alt={item.previousCard}
                                    src={`/cards/thumbnails/${item.previousCard}.png`}
                                    className="thumbnail_size_small"
                                />
                            ) : null}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default SinglesLeaderboard
