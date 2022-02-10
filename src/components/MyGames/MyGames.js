import React, { useState } from 'react'

import RemoveImage from '../../assets/icons/remove.png'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"

import GameService from '../../services/GameService'
import parseError from '../../utils/ErrorUtils'
import DataTable from 'react-data-table-component'
import TrophyImage from '../../assets/icons/trophy.png'

import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Card, CardBody, CardGroup, CardHeader } from 'reactstrap'
import moment from 'moment'

import { triggerBounceMessage } from '../../constants'

const MyGames = () => {
    const accessToken = useSelector(state => state.auth.accessToken)
    if (!accessToken) { return null }
    const myGames = useSelector(state => state.myGames.games)
    const myProfile = useSelector(state => state.myProfile)
    const dispatch = useDispatch()
    const [modalDeleteGameOpen, updateModalDeleteGameOpen] = useState(false)
    const [deleteGameId, updateDeleteGameId] = useState('')

    const deleteGame = e => {
        e.preventDefault()

        GameService.delete(deleteGameId, accessToken)
            .then(response => {
                dispatch({ type: 'myGames/removeGame', payload: deleteGameId })
                dispatch({ type: 'snackbar/message', payload: { type: 'info', message: 'Game deleted' } })
                handleCloseDeleteGameModal()
            })
            .catch(error => {
                if (error.message === triggerBounceMessage) { return }
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
    }

    const showDeleteGameModal = id => e => {
        updateModalDeleteGameOpen(true)
        updateDeleteGameId(id)
    }

    const handleCloseDeleteGameModal = () => {
        updateModalDeleteGameOpen(false)
        updateDeleteGameId('')
    }

    const parsePlayButtonLabel = (game, playerId) => {
        if (game.status === "ACTIVE") {
            if (isInGame(game, playerId)) {
                return "Play"
            }
            return "Spectate"
        }
        return "Result"
    }

    const parsePlayButtonColour = (game, playerId) => {
        if (game.status === "ACTIVE") {
            if (isInGame(game, playerId)) {
                return "success"
            }
            return "primary"
        }
        return "secondary"
    }

    const isWinner = (game, playerId) => {
        const player = game.players.find(e => e.id === playerId)
        
        return !!player && player.winner
    }

    const isInGame = (game, playerId) => {
        return game.players.some(e => e.id === playerId)
    }

    const columns = [
        { name: 'Name', selector: 'name', sortable: true },
        { name: 'Date', selector: 'timestamp', format: row => moment(row.timestamp).format('lll'), sortable: true },
        { 
            cell: row => <div>{ isWinner(row, myProfile.id) ? <img src={TrophyImage} width="25px" height="25px"/> : null }</div>,
            center: true
        },
        {
            cell: row => <Link to={`/game/${row.id}`}><Button type="button" color={parsePlayButtonColour(row, myProfile.id)}>{parsePlayButtonLabel(row, myProfile.id)}</Button></Link>,
            center: true
        },
        {
            cell: row => <Button disabled={row.adminId !== myProfile.id || row.status !== "ACTIVE"} type="button" color="link" onClick={showDeleteGameModal(row.id)}><img alt="Remove" src={RemoveImage} width="20px" height="20px" /></Button>,
            center: true,
            omit: !myProfile.isAdmin
        }
    ]

    return (
        <CardGroup>
            <Card color="secondary" className="p-6">
                <CardHeader tag="h2">Games</CardHeader>
                <CardBody>
                    <DataTable noHeader pagination theme="solarized"
                        data={myGames} columns={columns}
                        defaultSortField="timestamp" defaultSortAsc={false}
                        highlightOnHover />
                </CardBody>
            </Card>

            <Modal fade toggle={handleCloseDeleteGameModal} isOpen={modalDeleteGameOpen}>
                <ModalHeader>
                    You are about to Delete a game
                </ModalHeader>

                <ModalBody>Are you sure you want to delete this game?</ModalBody>

                <ModalFooter>
                    <Button color="secondary" onClick={handleCloseDeleteGameModal}>
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

export default MyGames;