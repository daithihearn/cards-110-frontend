import React from "react"
import DefaultHeader from "../Header/Header"
import MySnackbar from "../Snackbar/MySnackbar"
import GameWrapper from "./GameWrapper"
import GameOver from "./GameOver"
import GameService from "../../services/GameService"
import parseError from "../../utils/ErrorUtils"
import { useAuth0 } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"

const Game = () => {
  const dispatch = useDispatch()

  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0()

  if (isLoading) return loading()
  if (error) throw Error(error)
  if (!isAuthenticated) return loginWithRedirect()

  let { id } = useParams()

  const playGame = () => {
    getAccessTokenSilently()
      .then((accessToken) => {
        GameService.getGameState(id, accessToken)
          .then((response) => {
            dispatch({ type: "game/updateGame", payload: response.data })
            getPlayers()
          })
          .catch((error) => {
            dispatch({
              type: "snackbar/message",
              payload: { type: "error", message: parseError(error) },
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: "snackbar/message",
          payload: { type: "error", message: parseError(error) },
        })
      })
  }

  const getPlayers = () => {
    getAccessTokenSilently()
      .then((accessToken) => {
        GameService.getPlayersForGame(id, accessToken)
          .then((response) => {
            dispatch({ type: "game/updatePlayers", payload: response.data })
          })
          .catch((error) => {
            dispatch({
              type: "snackbar/message",
              payload: { type: "error", message: parseError(error) },
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: "snackbar/message",
          payload: { type: "error", message: parseError(error) },
        })
      })
  }

  playGame()

  return (
    <div>
      <div className="main_content">
        <span className="app" style={{ overflowX: "hidden" }}>
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

export default Game
