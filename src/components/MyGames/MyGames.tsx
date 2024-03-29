import React, { useMemo } from "react"

import { useNavigate } from "react-router-dom"

import PlayIcon from "@mui/icons-material/PlayCircleFilled"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VictoryIcon from "@mui/icons-material/EmojiEventsTwoTone"
import FailureIcon from "@mui/icons-material/MoneyOffTwoTone"

import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from "@mui/material"

import moment from "moment"
import { Game, GameStatus } from "model/Game"
import { Player } from "model/Player"
import { useGame } from "components/Hooks/useGame"
import { useProfiles } from "components/Hooks/useProfiles"

const sortByDate = (a: Game, b: Game) => {
    return moment(b.timestamp).diff(moment(a.timestamp))
}
// Filters out the dummy player and returns the number of players in the game
const getNumberOfPlayers = (players: Player[]) => {
    return players.filter(player => player.id !== "dummy").length
}

const MyGames = () => {
    const navigateTo = useNavigate()
    const { games } = useGame()

    const { myProfile } = useProfiles()

    const last10Games = useMemo(() => {
        if (!games) return []
        return [...games].sort(sortByDate).slice(0, 7)
    }, [games])

    const isGameActive = (game: Game) => {
        return game.status === GameStatus.ACTIVE
    }

    const isWinner = (game: Game, playerId: string) => {
        const player = game.players.find(e => e.id === playerId)

        return !!player && player.winner
    }

    const isLoser = (game: Game, playerId: string) => {
        if (game.status === GameStatus.ACTIVE) return false
        const player = game.players.find(e => e.id === playerId)

        return !!player && !player.winner
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={<Typography variant="h2">Games</Typography>}
                    />
                    <CardContent>
                        <List>
                            {last10Games.map(row => (
                                <ListItem key={row.id}>
                                    <ListItemIcon
                                        onClick={() =>
                                            navigateTo(`/game/${row.id}`)
                                        }
                                        sx={{
                                            cursor: "pointer",
                                        }}>
                                        {isGameActive(row) ? (
                                            <PlayIcon
                                                fontSize="large"
                                                aria-label="Play Game"
                                            />
                                        ) : (
                                            <VisibilityIcon
                                                fontSize="large"
                                                aria-label="View Game"
                                            />
                                        )}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={`${moment(
                                            row.timestamp,
                                        ).format("ll")} - ${row.name}`}
                                        secondary={`${getNumberOfPlayers(
                                            row.players,
                                        )} players`}
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    />

                                    {myProfile && (
                                        <ListItemSecondaryAction>
                                            {isWinner(row, myProfile.id) && (
                                                <VictoryIcon fontSize="large" />
                                            )}
                                            {isLoser(row, myProfile.id) && (
                                                <FailureIcon fontSize="large" />
                                            )}
                                        </ListItemSecondaryAction>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default MyGames
