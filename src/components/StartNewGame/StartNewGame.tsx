import React, { useCallback, useMemo, useState } from "react"

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
    Typography,
    useTheme,
} from "@mui/material"
import { PlayerProfile } from "model/Player"
import { useSnackbar } from "notistack"
import { FormatName } from "utils/FormattingUtils"
import WinPercentageGraph from "components/GameStats/WinPercentageGraph"
import { useProfiles } from "components/Hooks/useProfiles"
import { useGame } from "components/Hooks/useGame"

const StartNewGame = () => {
    const theme = useTheme()
    const { enqueueSnackbar } = useSnackbar()
    const { allProfiles } = useProfiles()
    const { createGame } = useGame()

    const [newGameName, setNewGameName] = useState("")

    const [selectedPlayers, setSelectedPlayers] = useState<PlayerProfile[]>([])

    const orderedPlayers = useMemo(() => {
        if (allProfiles.length < 1) return []
        // Sort by last lastAccess which is a string timestamp in the form 1970-01-01T00:00:00
        return [...allProfiles].sort((a, b) => {
            const aDate = new Date(a.lastAccess)
            const bDate = new Date(b.lastAccess)
            return bDate.getTime() - aDate.getTime()
        })
    }, [allProfiles])

    const togglePlayer = useCallback(
        (player: PlayerProfile) => {
            if (selectedPlayers?.includes(player)) {
                setSelectedPlayers(
                    selectedPlayers.filter(p => p.id !== player.id),
                )
            } else {
                setSelectedPlayers([...selectedPlayers, player])
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

            createGame(payload)
        },
        [selectedPlayers, newGameName],
    )

    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewGameName(e.target.value)
        },
        [],
    )

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={
                            <Typography variant="h2">
                                Start a new game
                            </Typography>
                        }
                    />
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
                                                selected={selectedPlayers?.includes(
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
                                                                    alt="Preview"
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
