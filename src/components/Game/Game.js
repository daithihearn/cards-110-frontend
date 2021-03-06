import React from 'react'
import DefaultHeader from '../Header/Header'
import MySnackbar from '../Snackbar/MySnackbar'
import GameWrapper from './GameWrapper'
import GameOver from './GameOver'
import GameService from '../../services/GameService'
import parseError from '../../utils/ErrorUtils'

import { useParams } from "react-router-dom"

import { useDispatch } from 'react-redux'

const Game = () => {

    let { id } = useParams()

    const dispatch = useDispatch()

    const playGame = () => {
        GameService.getGameState(id)
            .then(response => {
                dispatch({ type: 'game/updateGame', payload: response.data })
                dispatch({ type: 'snackbar/message', payload: { type: 'success', message: "Game started succcessfully." } })
                getPlayers()
            })
            .catch(error => {
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
    }

    const getPlayers = () => {
        GameService.getPlayersForGame(id)
            .then(response => {
                dispatch({ type: 'game/updatePlayers', payload: response.data })
            })
            .catch(error => {
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
    }

    playGame()

    return (
        <div>
            <div className="main_content">
                <span className="app" style={{ overflowX: 'hidden' }}>
                    <div className="app_body">
                        <main className="main">
                            <DefaultHeader />
                            <MySnackbar />

                            <div className="app carpet">
                                <div className="game_wrap">
                                    <div className="game_container">
                                        <GameWrapper />
                                        <GameOver />
                                    </div>
                                </div>
                            </div>


                        </main>
                    </div>
                </span>
            </div>
        </div>

    )
}

export default Game;
