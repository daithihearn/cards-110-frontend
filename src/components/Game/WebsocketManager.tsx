import React, { useState } from "react"

import { StompSessionProvider, useSubscription } from "react-stomp-hooks"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
  clearSelectedCards,
  getGame,
  getGameId,
  updateGame,
} from "../../caches/GameSlice"
import { getAccessToken } from "../../caches/MyProfileSlice"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { GameState, GameStateResponse } from "../../model/Game"
import { Actions, BuyCardsEvent } from "../../model/Events"
import { useSnackbar } from "notistack"

// const shuffleSound = new Audio("../../assets/sounds/shuffle.ogg")
// const playCardSound = new Audio("../../assets/sounds/play_card.ogg")
// const alertSound = new Audio("../../assets/sounds/alert.ogg")
// const callSound = new Audio("../../assets/sounds/call.ogg")
// const passSound = new Audio("../../assets/sounds/pass.ogg")

// const playShuffleSound = () => {
//   shuffleSound.play().catch(() => console.error("Error playing shuffle sound!"))
// }

// const playPlayCardSound = () => {
//   playCardSound
//     .play()
//     .catch(() => console.error("Error playing play card sound!"))
// }

// const playAlertSound = () => {
//   alertSound.play().catch(() => console.error("Error playing alert sound!"))
// }

// const playCallSound = () => {
//   callSound.play().catch(() => console.error("Error playing call sound!"))
// }

// const playPassSound = () => {
//   passSound.play().catch(() => console.error("Error playing pass sound!"))
// }

interface ActionEvent {
  type: Actions
  content: unknown
}

const WebsocketHandler = () => {
  const dispatch = useAppDispatch()

  const game = useAppSelector(getGame)
  const playerProfiles = useAppSelector(getPlayerProfiles)
  const { enqueueSnackbar } = useSnackbar()

  const [previousAction, updatePreviousAction] = useState<Actions>()

  const handleWebsocketMessage = (message: string) => {
    if (previousAction === "LAST_CARD_PLAYED") {
      console.info("Waiting on last card to allow time to view cards...")
      setTimeout(() => processWebsocketMessage(message), 4000)
    } else {
      processWebsocketMessage(message)
    }
  }

  const processWebsocketMessage = (message: string) => {
    const payload = JSON.parse(message)
    const actionEvent = JSON.parse(payload.payload) as ActionEvent

    updatePreviousAction(actionEvent.type)
    processActons(actionEvent.type, actionEvent.content)

    if (actionEvent.type !== Actions.BuyCardsNotification)
      dispatch(updateGame(actionEvent.content as GameStateResponse))
  }

  const checkClearSelected = () => {
    // If I played the card clear the selected cards
    if (game.isMyGo) {
      dispatch(clearSelectedCards())
    }
  }

  const processActons = (type: Actions, payload: unknown) => {
    switch (type) {
      case "DEAL":
        // playShuffleSound()
        break
      case "CHOOSE_FROM_DUMMY":
      case "BUY_CARDS":
      case "LAST_CARD_PLAYED":
      case "CARD_PLAYED":
        // playPlayCardSound()
        checkClearSelected()
        break
      case "REPLAY":
        break
      case "GAME_OVER":
        break
      case "BUY_CARDS_NOTIFICATION":
        const buyCardsEvt = payload as BuyCardsEvent
        const player = playerProfiles.find((p) => p.id === buyCardsEvt.playerId)
        if (!player) {
          break
        }

        enqueueSnackbar(`${player.name} bought ${buyCardsEvt.bought}`)

        break
      case "HAND_COMPLETED":
        break
      case "ROUND_COMPLETED":
        break
      case "CALL":
        // playCallSound()
        break
      case "PASS":
        // playPassSound()
        break
    }
  }

  useSubscription(["/game", "/user/game"], (message) =>
    handleWebsocketMessage(message.body)
  )

  return null
}

const WebsocketManager = () => {
  const gameId = useAppSelector(getGameId)
  const accessToken = useAppSelector(getAccessToken)

  if (!gameId) return null

  return (
    <StompSessionProvider
      url={`${process.env.REACT_APP_WEBSOCKET_URL}/websocket?gameId=${gameId}&tokenId=${accessToken}`}
    >
      <WebsocketHandler />
    </StompSessionProvider>
  )
}

export default WebsocketManager
