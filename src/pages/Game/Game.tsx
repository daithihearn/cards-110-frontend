import React, { useEffect } from "react"
import GameWrapper from "../../components/Game/GameWrapper"
import GameOver from "../../components/Game/GameOver"
import GameService from "../../services/GameService"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import { isGameActive } from "../../caches/GameSlice"

const Game = () => {
  const dispatch = useAppDispatch()
  let { id } = useParams<string>()
  const { enqueueSnackbar } = useSnackbar()
  const gameActive = useAppSelector(isGameActive)

  useEffect(() => {
    if (id)
      dispatch(GameService.refreshGameState(id)).catch((e: Error) =>
        enqueueSnackbar(e.message, { variant: "error" })
      )
  }, [id])

  useEffect(() => {
    if (id)
      dispatch(GameService.getPlayersForGame(id)).catch((e: Error) =>
        enqueueSnackbar(e.message, { variant: "error" })
      )
  }, [id])

  return (
    <>
      <div className="app carpet">
        <div className="game_wrap">
          <div className="game_container">
            {gameActive ? <GameWrapper /> : <GameOver />}
          </div>
        </div>
      </div>
    </>
  )
}

export default withAuthenticationRequired(Game)
