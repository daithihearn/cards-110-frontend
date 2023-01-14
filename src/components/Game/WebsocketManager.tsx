import React, { useCallback, useState } from "react"

import { StompSessionProvider, useSubscription } from "react-stomp-hooks"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getGameId, updateGame } from "../../caches/GameSlice"
import { getAccessToken } from "../../caches/MyProfileSlice"
import { getPlayerProfiles } from "../../caches/PlayerProfilesSlice"
import { GameState } from "../../model/Game"
import { Actions, BuyCardsEvent } from "../../model/Events"
import { useSnackbar } from "notistack"
import { clearSelectedCards, updateMyCards } from "../../caches/MyCardsSlice"
import { clearAutoPlay } from "../../caches/AutoPlaySlice"
import useSound from "use-sound"

interface ActionEvent {
  type: Actions
  content: unknown
}

const WebsocketHandler = () => {
  const dispatch = useAppDispatch()

  const [shuffleSound] = useSound("../../assets/sounds/shuffle.ogg", {
    volume: 0.25,
  })

  const [playCardSound] = useSound("../../assets/sounds/play_card.ogg", {
    volume: 0.25,
  })

  // const [alertSound] = useSound("../../assets/sounds/alert.ogg", {
  //   volume: 0.25,
  // })

  const [callSound] = useSound("../../assets/sounds/call.ogg", {
    volume: 0.25,
  })

  const [passSound] = useSound("../../assets/sounds/pass.ogg", {
    volume: 0.25,
  })

  const playerProfiles = useAppSelector(getPlayerProfiles)
  const { enqueueSnackbar } = useSnackbar()

  const [previousAction, updatePreviousAction] = useState<Actions>()

  const handleWebsocketMessage = useCallback(
    (message: string) => {
      if (previousAction === "LAST_CARD_PLAYED") {
        console.info("Waiting on last card to allow time to view cards...")
        setTimeout(() => processWebsocketMessage(message), 4000)
      } else {
        processWebsocketMessage(message)
      }
    },
    [previousAction]
  )

  const processWebsocketMessage = (message: string) => {
    const payload = JSON.parse(message)
    const actionEvent = JSON.parse(payload.payload) as ActionEvent

    updatePreviousAction(actionEvent.type)
    processActons(actionEvent.type, actionEvent.content)

    if (actionEvent.type !== Actions.BuyCardsNotification) {
      const gameState = actionEvent.content as GameState
      dispatch(updateGame(gameState))
    }
  }

  const reloadCards = (payload: unknown) => {
    dispatch(clearSelectedCards())
    dispatch(clearAutoPlay())
    const gameState = payload as GameState
    dispatch(updateMyCards(gameState.cards))
  }

  const processActons = useCallback(
    (type: Actions, payload: unknown) => {
      switch (type) {
        case "DEAL":
          shuffleSound()
          reloadCards(payload)
          break
        case "CHOOSE_FROM_DUMMY":
        case "BUY_CARDS":
        case "LAST_CARD_PLAYED":
        case "CARD_PLAYED":
          playCardSound()
          reloadCards(payload)
          break
        case "REPLAY":
          break
        case "GAME_OVER":
          break
        case "BUY_CARDS_NOTIFICATION":
          const buyCardsEvt = payload as BuyCardsEvent
          const player = playerProfiles.find(
            (p) => p.id === buyCardsEvt.playerId
          )
          if (!player) {
            break
          }

          enqueueSnackbar(`${player.name} bought ${buyCardsEvt.bought}`)

          break
        case "HAND_COMPLETED":
          break
        case "ROUND_COMPLETED":
          reloadCards(payload)
          break
        case "CALL":
          callSound()
          reloadCards(payload)
          break
        case "PASS":
          passSound()
          reloadCards(payload)
          break
      }
    },
    [playerProfiles]
  )

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
