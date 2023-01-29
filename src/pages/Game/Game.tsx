import React, { useCallback, useEffect } from "react"
import GameWrapper from "../../components/Game/GameWrapper"
import GameOver from "../../components/Game/GameOver"
import GameService from "../../services/GameService"
import PullToRefresh from "react-simple-pull-to-refresh"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import {
    getIamSpectator,
    getIsGameActive,
    resetGame,
} from "../../caches/GameSlice"
import { clearAutoPlay } from "../../caches/AutoPlaySlice"
import { clearMyCards } from "../../caches/MyCardsSlice"
import RefreshingData from "../../components/icons/RefreshingData"
import parseError from "../../utils/ErrorUtils"

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
    }, [iamSpectator])

    useEffect(() => {
        fetchData()

        return () => {
            console.log("Resetting game")
            dispatch(resetGame())
            dispatch(clearMyCards())
            dispatch(clearAutoPlay())
        }
    }, [id, iamSpectator])

    return (
        <PullToRefresh
            onRefresh={fetchData}
            refreshingContent={<RefreshingData />}>
            <div className="app carpet">
                <div className="game_wrap">
                    <div className="game_container">
                        {isGameActive ? <GameWrapper /> : <GameOver />}
                    </div>
                </div>
            </div>
        </PullToRefresh>
    )
}

export default withAuthenticationRequired(Game)
