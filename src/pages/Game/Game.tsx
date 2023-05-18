import React, { useCallback, useEffect } from "react"
import GameWrapper from "components/Game/GameWrapper"
import GameOver from "components/Game/GameOver"
import GameService from "services/GameService"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "caches/hooks"
import { useSnackbar } from "notistack"
import { getIamSpectator, getIsGameActive, resetGame } from "caches/GameSlice"
import { clearAutoPlay } from "caches/AutoPlaySlice"
import { clearMyCards } from "caches/MyCardsSlice"
import parseError from "utils/ErrorUtils"

const Game = () => {
    const dispatch = useAppDispatch()
    let { id } = useParams<string>()
    const { enqueueSnackbar } = useSnackbar()
    const iamSpectator = useAppSelector(getIamSpectator)
    const isGameActive = useAppSelector(getIsGameActive)

    const fetchData = useCallback(async () => {
        if (id)
            await dispatch(
                GameService.refreshGameState(id, iamSpectator),
            ).catch((e: Error) =>
                enqueueSnackbar(parseError(e), { variant: "error" }),
            )

        await dispatch(GameService.getAllPlayers()).catch((e: Error) =>
            enqueueSnackbar(parseError(e), { variant: "error" }),
        )
    }, [id, iamSpectator])

    useEffect(() => {
        fetchData()
    }, [id, iamSpectator])

    useEffect(() => {
        return () => {
            console.log("Clearing game")
            dispatch(clearMyCards())
            dispatch(clearAutoPlay())
            dispatch(resetGame())
        }
    }, [])

    return (
        <div className="app">
            <div className="game-wrap">
                <div className="game-container">
                    {isGameActive ? <GameWrapper /> : <GameOver />}
                </div>
            </div>
        </div>
    )
}

export default withAuthenticationRequired(Game)
