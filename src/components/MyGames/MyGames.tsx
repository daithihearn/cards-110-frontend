import React, { useCallback, useState } from "react"

import RemoveImage from "../../assets/icons/remove.png"
import { Link } from "react-router-dom"

import GameService from "../../services/GameService"

import DataTable, { TableColumn } from "react-data-table-component"
import TrophyImage from "../../assets/icons/trophy.png"

import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
    Card,
    CardBody,
    CardGroup,
    CardHeader,
} from "reactstrap"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getMyGames } from "../../caches/MyGamesSlice"
import { getMyProfile } from "../../caches/MyProfileSlice"
import { useSnackbar } from "notistack"
import { Game, GameStatus } from "../../model/Game"

const MyGames = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const myGames = useAppSelector(getMyGames)
    const myProfile = useAppSelector(getMyProfile)

    const [modalDeleteGameOpen, updateModalDeleteGameOpen] = useState(false)
    const [deleteGameId, updateDeleteGameId] = useState("")

    const deleteGame = () => {
        dispatch(GameService.deleteGame(deleteGameId))
            .then(() => {
                enqueueSnackbar("Game deleted")
                handleCloseDeleteGameModal()
            })
            .catch((e: Error) =>
                enqueueSnackbar(e.message, { variant: "error" }),
            )
    }

    const showDeleteGameModal = (id: string) => {
        updateModalDeleteGameOpen(true)
        updateDeleteGameId(id)
    }

    const handleCloseDeleteGameModal = useCallback(() => {
        updateModalDeleteGameOpen(false)
        updateDeleteGameId("")
    }, [updateDeleteGameId, updateModalDeleteGameOpen])

    const parsePlayButtonLabel = (game: Game, playerId: string) => {
        if (game.status === GameStatus.ACTIVE) {
            if (isInGame(game, playerId)) {
                return "Play"
            }
            return "Spectate"
        }
        return "Result"
    }

    const parsePlayButtonColour = (game: Game, playerId: string) => {
        if (game.status === GameStatus.ACTIVE) {
            if (isInGame(game, playerId)) {
                return "success"
            }
            return "primary"
        }
        return "secondary"
    }

    const isWinner = (game: Game, playerId: string) => {
        const player = game.players.find(e => e.id === playerId)

        return !!player && player.winner
    }

    const isInGame = (game: Game, playerId: string) => {
        return game.players.some(e => e.id === playerId)
    }

    const columns: TableColumn<Game>[] = [
        {
            cell: row => (
                <Link to={`/game/${row.id}`}>
                    <Button
                        type="button"
                        color={parsePlayButtonColour(row, myProfile.id!)}>
                        {parsePlayButtonLabel(row, myProfile.id!)}
                    </Button>
                </Link>
            ),
            center: true,
        },
        { name: "Name", selector: row => row.name, sortable: true },
        {
            name: "Date",
            selector: row => row.timestamp,
            format: row => moment(row.timestamp).format("lll"),
            sortable: true,
        },
        {
            cell: row => (
                <div>
                    {isWinner(row, myProfile.id!) ? (
                        <img src={TrophyImage} width="25px" height="25px" />
                    ) : null}
                </div>
            ),
            center: true,
        },

        {
            cell: row => (
                <Button
                    disabled={
                        row.adminId !== myProfile.id ||
                        row.status !== GameStatus.ACTIVE
                    }
                    type="button"
                    color="link"
                    onClick={() => showDeleteGameModal(row.id)}>
                    <img
                        alt="Remove"
                        src={RemoveImage}
                        width="20px"
                        height="20px"
                    />
                </Button>
            ),
            center: true,
            omit: !myProfile.isAdmin,
        },
    ]

    return (
        <CardGroup>
            <Card color="secondary" className="p-6">
                <CardHeader tag="h2">Games</CardHeader>
                <CardBody>
                    <DataTable
                        noHeader
                        pagination
                        theme="solarized"
                        data={myGames}
                        columns={columns}
                        defaultSortFieldId={3}
                        defaultSortAsc={false}
                        highlightOnHover
                    />
                </CardBody>
            </Card>

            <Modal
                fade
                toggle={handleCloseDeleteGameModal}
                isOpen={modalDeleteGameOpen}>
                <ModalHeader>You are about to Delete a game</ModalHeader>

                <ModalBody>
                    Are you sure you want to delete this game?
                </ModalBody>

                <ModalFooter>
                    <Button
                        color="secondary"
                        onClick={handleCloseDeleteGameModal}>
                        No
                    </Button>
                    <Button color="primary" onClick={deleteGame}>
                        Yes
                    </Button>
                </ModalFooter>
            </Modal>
        </CardGroup>
    )
}

export default MyGames
