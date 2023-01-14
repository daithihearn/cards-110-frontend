import React, { useCallback, useEffect } from "react"
import GameWrapper from "../../components/Game/GameWrapper"
import GameOver from "../../components/Game/GameOver"
import GameService from "../../services/GameService"
import PullToRefresh from "react-simple-pull-to-refresh"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { useSnackbar } from "notistack"
import { getHasGame, resetGame } from "../../caches/GameSlice"
import DataLoader from "../../components/DataLoader/DataLoader"
import { clearAutoPlay } from "../../caches/AutoPlaySlice"
import { clearMyCards } from "../../caches/MyCardsSlice"

const Game = () => {
  const dispatch = useAppDispatch()
  let { id } = useParams<string>()
  const { enqueueSnackbar } = useSnackbar()
  const hasGame = useAppSelector(getHasGame)

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

  const handleRefresh = useCallback(async () => {
    if (id)
      await dispatch(GameService.refreshGameState(id)).catch((e: Error) =>
        enqueueSnackbar(e.message, { variant: "error" })
      )
  }, [id])

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="app carpet">
        <div className="game_wrap">
          <div className="game_container">
            <DataLoader />
            {hasGame ? <GameWrapper /> : <GameOver />}
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}

export default withAuthenticationRequired(Game)
