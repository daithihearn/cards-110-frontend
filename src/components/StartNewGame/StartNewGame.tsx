import React, { useCallback, useMemo, useState } from "react"

import GameService from "services/GameService"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"

import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { PlayerProfile } from "model/Player"
import { useSnackbar } from "notistack"
import parseError from "utils/ErrorUtils"
import { FormatName } from "utils/FormattingUtils"
import WinPercentageGraph from "components/GameStats/WinPercentageGraph"

const StartNewGame = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [newGameName, updateNewGameName] = useState("")
    const allPlayers = useAppSelector(getPlayerProfiles)

    const [selectedPlayers, updateSelectedPlayers] = useState<PlayerProfile[]>(
        [],
    )

    const orderedPlayers = useMemo(() => {
        if (!allPlayers || allPlayers.length < 1) return []
        // Sort by last lastAccess which is a string timestamp in the form 1970-01-01T00:00:00
        return [...allPlayers]
            .filter(p => {
                // Filter out players that have not played in the last 3 months
                const lastAccess = new Date(p.lastAccess)
                const threeMonthsAgo = new Date()
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
                return lastAccess.getTime() > threeMonthsAgo.getTime()
            })
            .sort((a, b) => {
                const aDate = new Date(a.lastAccess)
                const bDate = new Date(b.lastAccess)
                return bDate.getTime() - aDate.getTime()
            })
    }, [allPlayers])

    const togglePlayer = useCallback(
        (player: PlayerProfile) => {
            if (selectedPlayers.includes(player)) {
                updateSelectedPlayers(
                    selectedPlayers.filter(p => p.id !== player.id),
                )
            } else {
                updateSelectedPlayers([...selectedPlayers, player])
            }
        },
        [selectedPlayers],
    )

    const startGame = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (selectedPlayers.length < 1) {
                enqueueSnackbar("You must select at least one player", {
                    variant: "error",
                })
                return
            }
            if (newGameName === "") {
                enqueueSnackbar("You must provide a name for the game", {
                    variant: "error",
                })
                return
            }

            const payload = {
                players: selectedPlayers.map(p => p.id),
                name: newGameName,
            }

            dispatch(GameService.put(payload))
                .then(() => {
                    updateNewGameName("")
                    enqueueSnackbar("Game started successfully", {
                        variant: "success",
                    })
                })
                .catch((e: Error) =>
                    enqueueSnackbar(parseError(e), { variant: "error" }),
                )
        },
        [selectedPlayers, newGameName],
    )

    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateNewGameName(e.target.value)
        },
        [],
    )

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Start a new game" />
                    <CardContent>
                        <FormControl fullWidth>
                            <form onSubmit={startGame}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <FormControl variant="outlined">
                                            <InputLabel htmlFor="newGameName">
                                                Game Name
                                            </InputLabel>
                                            <OutlinedInput
                                                id="newGameName"
                                                name="newGameName"
                                                placeholder="Give the game a name"
                                                autoComplete="off"
                                                onChange={handleNameChange}
                                                value={newGameName}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ButtonGroup>
                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={startGame}
                                                disabled={
                                                    selectedPlayers.length <
                                                        2 ||
                                                    (!newGameName &&
                                                        newGameName === "")
                                                }>
                                                Start Game
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </form>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Player</TableCell>
                                            <TableCell>Last 3 months</TableCell>
                                            <TableCell>All Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderedPlayers.map(player => (
                                            <TableRow
                                                key={player.id}
                                                onClick={() =>
                                                    togglePlayer(player)
                                                }
                                                selected={selectedPlayers.includes(
                                                    player,
                                                )}
                                                sx={{
                                                    cursor: "pointer",
                                                    "&.Mui-selected, &.Mui-selected:hover":
                                                        {
                                                            backgroundColor:
                                                                theme.palette
                                                                    .action
                                                                    .selected,
                                                        },
                                                }}>
                                                <TableCell>
                                                    <div>
                                                        <Grid container>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                sx={{
                                                                    textAlign:
                                                                        "center",
                                                                }}>
                                                                <img
                                                                    alt="Image Preview"
                                                                    src={
                                                                        player.picture
                                                                    }
                                                                    className="avatar-large"
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                sx={{
                                                                    textAlign:
                                                                        "center",
                                                                }}>
                                                                {FormatName(
                                                                    player.name,
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <WinPercentageGraph
                                                        player={player}
                                                        last3Months={true}
                                                        width={80}
                                                        height={80}
                                                        showLegend={false}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <WinPercentageGraph
                                                        player={player}
                                                        last3Months={false}
                                                        width={80}
                                                        height={80}
                                                        showLegend={false}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </FormControl>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default StartNewGame
