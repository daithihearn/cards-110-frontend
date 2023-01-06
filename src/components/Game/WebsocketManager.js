import React, { useState } from "react"
import { doPlayersMatchProfiles } from "../../constants"

import { StompSessionProvider, useSubscription } from "react-stomp-hooks"

import { useDispatch, useSelector } from "react-redux"

import shuffleAudio from "../../assets/sounds/shuffle.ogg"
import playCardAudio from "../../assets/sounds/play_card.ogg"
import alertAudio from "../../assets/sounds/alert.ogg"
import callAudio from "../../assets/sounds/call.ogg"
import passAudio from "../../assets/sounds/pass.ogg"

const WebsocketHandler = (props) => {
  const dispatch = useDispatch()
  const game = props.game
  const players = props.players

  const [previousAction, updatePreviousAction] = useState("")

  const handleWebsocketMessage = (message) => {
    if (previousAction === "LAST_CARD_PLAYED") {
      console.log("Waiting on last card to allow time to view cards...")
      setTimeout(() => processWebsocketMessage(message), 4000)
    } else {
      processWebsocketMessage(message)
    }
  }

  const processWebsocketMessage = (message) => {
    let payload = JSON.parse(message)
    let publishContent = JSON.parse(payload.payload)

    updatePreviousAction(publishContent.type)
    processActons(publishContent.type, publishContent.content)

    if (publishContent.type !== "BUY_CARDS_NOTIFICATION") {
      updateGame(publishContent.content)
    }
  }

  const updateGame = (game) => {
    dispatch({ type: "game/updateGame", payload: game })
  }

  const shuffleSound = new Audio(shuffleAudio)
  const playCardSound = new Audio(playCardAudio)
  const alertSound = new Audio(alertAudio)
  const callSound = new Audio(callAudio)
  const passSound = new Audio(passAudio)

  const playShuffleSound = () => {
    shuffleSound
      .play()
      .then((_) => {
        console.log("Shuffle sound played!")
      })
      .catch((error) => {
        console.log("Error playing shuffle sound!")
      })
  }

  const playPlayCardSound = () => {
    playCardSound
      .play()
      .then((_) => {
        console.log("Play card sound played!")
      })
      .catch((error) => {
        console.log("Error playing play card sound!")
      })
  }

  const playAlertSound = () => {
    alertSound
      .play()
      .then((_) => {
        console.log("Alert sound played!")
      })
      .catch((error) => {
        console.log("Error playing alert sound!")
      })
  }

  const playCallSound = () => {
    callSound
      .play()
      .then((_) => {
        console.log("Call sound played!")
      })
      .catch((error) => {
        console.log("Error playing call sound!")
      })
  }

  const playPassSound = () => {
    passSound
      .play()
      .then((_) => {
        console.log("Call pass played!")
      })
      .catch((error) => {
        console.log("Error playing pass sound!")
      })
  }

  const checkClearSelected = () => {
    // If I played the card clear the selected cards
    if (game.isMyGo) {
      dispatch({ type: "game/clearSelectedCards" })
    }
  }

  const setAlert = () => {
    let thisObj = this
    let stateDelta = { activeAlert: uuid() }
    sleep(10000).then(() => {
      if (
        !!thisObj.state.activeAlert &&
        thisObj.state.activeAlert === stateDelta.activeAlert
      ) {
        playAlertSound()
        let stateUpdate = thisObj.state
        Object.assign(stateUpdate, thisObj.cancelAlert())
        thisObj.setState(stateUpdate)
      }
    })

    return stateDelta
  }

  const cancelAlert = () => {
    if (!!this.state.activeAlert) {
      return { activeAlert: null }
    }
  }

  const processActons = (type, payload) => {
    switch (type) {
      case "DEAL":
        playShuffleSound()
        break
      case "CHOOSE_FROM_DUMMY":
      case "BUY_CARDS":
      case "LAST_CARD_PLAYED":
      case "CARD_PLAYED":
        playPlayCardSound()
        checkClearSelected()
        break
      case "REPLAY":
        break
      case "GAME_OVER":
        break
      case "BUY_CARDS_NOTIFICATION":
        const player = players.find((p) => p.id === payload.playerId)
        if (!player) {
          break
        }
        dispatch({
          type: "snackbar/message",
          payload: {
            type: "success",
            message: `${player.name} bought ${payload.bought}`,
          },
        })
        break
      case "HAND_COMPLETED":
        break
      case "ROUND_COMPLETED":
        break
      case "CALL":
        playCallSound()
        break
      case "PASS":
        playPassSound()
        break
    }
  }

  useSubscription(["/game", "/user/game"], (message) =>
    handleWebsocketMessage(message.body)
  )

  return null
}

const WebsocketManager = (props) => {
  const myProfile = useSelector((state) => state.myProfile)
  if (!myProfile.accessToken) return null

  const game = props.game
  const players = props.players
  if (
    !game ||
    !game.status ||
    !players ||
    players.length === 0 ||
    !doPlayersMatchProfiles(players, game.playerProfiles)
  ) {
    return null
  }

  return (
    <StompSessionProvider
      url={`${process.env.REACT_APP_WEBSOCKET_URL}/websocket?gameId=${props.game.id}&tokenId=${myProfile.accessToken}`}
    >
      <WebsocketHandler game={game} players={players} />
    </StompSessionProvider>
  )
}

export default WebsocketManager
