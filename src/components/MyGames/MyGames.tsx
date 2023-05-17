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
} from "@mui/material"

import moment from "moment"
import { useAppSelector } from "caches/hooks"
import { getMyGames } from "caches/MyGamesSlice"
import { getMyProfile } from "caches/MyProfileSlice"
import { Game, GameStatus } from "model/Game"
import { Player } from "model/Player"

const sortByDate = (a: Game, b: Game) => {
    return moment(b.timestamp).diff(moment(a.timestamp))
}
// Filters out the dummy player and returns the number of players in the game
const getNumberOfPlayers = (players: Player[]) => {
    return players.filter(player => player.id !== "dummy").length
}

const MyGames = () => {
    const navigateTo = useNavigate()

    const myGames = useAppSelector(getMyGames)
    const myProfile = useAppSelector(getMyProfile)

    const last10Games = useMemo(() => {
        return [...myGames].sort(sortByDate).slice(0, 7)
    }, [myGames])

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
                    <CardHeader title="Games" />
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
                                            <PlayIcon />
                                        ) : (
                                            <VisibilityIcon />
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

                                    <ListItemSecondaryAction>
                                        {isWinner(row, myProfile.id!) && (
                                            <VictoryIcon />
                                        )}
                                        {isLoser(row, myProfile.id!) && (
                                            <FailureIcon />
                                        )}
                                    </ListItemSecondaryAction>
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
