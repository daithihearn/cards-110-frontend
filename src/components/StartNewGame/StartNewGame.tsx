import React, { useCallback, useState } from "react"

import GameService from "../../services/GameService"
import DataTable, { TableColumn } from "react-data-table-component"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"

import {
    Label,
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    Input,
    Card,
    CardBody,
    CardGroup,
    CardHeader,
} from "reactstrap"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { PlayerProfile } from "../../model/Player"
import { useSnackbar } from "notistack"
import { customStyles } from "../Tables/CustomStyles"

const StartNewGame = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [newGameName, updateNewGameName] = useState("")
    const allPlayers = useAppSelector(getPlayerProfiles)

    const [selectedPlayers, updateSelectedPlayers] = useState<PlayerProfile[]>(
        [],
    )

    const togglePlayer = useCallback(
        (rows: { selectedRows: React.SetStateAction<PlayerProfile[]> }) => {
            updateSelectedPlayers(rows.selectedRows)
        },
        [],
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
                players: selectedPlayers.map(p => p.id!),
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
                    enqueueSnackbar(e.message, { variant: "error" }),
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

    const columns: TableColumn<PlayerProfile>[] = [
        {
            name: "Avatar",
            cell: (row: PlayerProfile) => (
                <img alt="Image Preview" src={row.picture} className="avatar" />
            ),
        },
        {
            name: "Player",
            selector: row => row.name,
            sortable: true,
        },
    ]

    return (
        <CardGroup>
            <Card className="data-card">
                <CardHeader tag="h2">Start a new game</CardHeader>
                <CardBody>
                    <FormGroup>
                        <DataTable
                            noHeader
                            pagination
                            theme="solarized"
                            data={allPlayers}
                            columns={columns}
                            highlightOnHover
                            selectableRows
                            customStyles={customStyles}
                            onSelectedRowsChange={togglePlayer}
                        />

                        <Form onSubmit={startGame}>
                            <FormGroup>
                                <Label for="exampleText">Name</Label>
                                <Input
                                    className="name"
                                    id="newGameName"
                                    name="newGameName"
                                    placeholder="Give the game a name"
                                    autoComplete="off"
                                    onChange={handleNameChange}
                                    value={newGameName}
                                    disabled={selectedPlayers.length < 2}
                                    required
                                />
                            </FormGroup>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color="primary"
                                    type="submit"
                                    onClick={startGame}
                                    disabled={
                                        selectedPlayers.length < 2 ||
                                        (!newGameName && newGameName === "")
                                    }>
                                    Start Game
                                </Button>
                            </ButtonGroup>
                        </Form>
                    </FormGroup>
                </CardBody>
            </Card>
        </CardGroup>
    )
}

export default StartNewGame
