import React, { useEffect } from "react"
import GameWrapper from "../../components/Game/GameWrapper"
import GameOver from "../../components/Game/GameOver"
import GameService from "../../services/GameService"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import { isGameActive, resetGame } from "../../caches/GameSlice"
import DataLoader from "../../components/DataLoader/DataLoader"
import { clearAutoPlay } from "../../caches/AutoPlaySlice"
import { clearMyCards } from "../../caches/MyCardsSlice"

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

    return () => {
      console.log("Resetting game")
      dispatch(resetGame())
      dispatch(clearMyCards())
      dispatch(clearAutoPlay())
    }
  }, [id])

  return (
    <>
      <div className="app carpet">
        <div className="game_wrap">
          <div className="game_container">
            <DataLoader />
            {gameActive ? <GameWrapper /> : <GameOver />}
          </div>
        </div>
      </div>
    </>
  )
}

export default withAuthenticationRequired(Game)
