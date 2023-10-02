import React, { useCallback, useEffect, useState } from "react"

import { StompSessionProvider, useSubscription } from "react-stomp-hooks"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import {
    disableActions,
    getGameId,
    getIsMyGo,
    getIamSpectator,
    updateGame,
    updatePlayedCards,
} from "caches/GameSlice"
import { getAccessToken } from "caches/MyProfileSlice"
import { getPlayerProfiles } from "caches/PlayerProfilesSlice"
import { GameState } from "model/Game"
import { Actions, BuyCardsEvent } from "model/Events"
import { useSnackbar } from "notistack"
import { clearSelectedCards, updateMyCards } from "caches/MyCardsSlice"
import { clearAutoPlay } from "caches/PlayCardSlice"

import shuffleAudioFile from "assets/sounds/shuffle.ogg"
import playCardAudioFile from "assets/sounds/play_card.ogg"
import callAudioFile from "assets/sounds/call.ogg"
import passAudioFile from "assets/sounds/pass.ogg"
import AutoActionManager from "./AutoActionManager"
import { Round } from "model/Round"
import { CardName } from "model/Cards"

const shuffleAudio = new Audio(shuffleAudioFile)
const playCardAudio = new Audio(playCardAudioFile)
const callAudio = new Audio(callAudioFile)
const passAudio = new Audio(passAudioFile)

const shuffleSound = () => {
    shuffleAudio
        .play()
        .catch(() => console.error("Error playing shuffle sound!"))
}

const playCardSound = () => {
    playCardAudio
        .play()
        .catch(() => console.error("Error playing play card sound!"))
}

const callSound = () => {
    callAudio.play().catch(() => console.error("Error playing call sound!"))
}

const passSound = () => {
    passAudio.play().catch(() => console.error("Error playing pass sound!"))
}

interface ActionEvent {
    type: Actions
    gameState: GameState
    transitionData: unknown
}

const WebsocketHandler = () => {
    const dispatch = useAppDispatch()

    const [autoActionEnabled, setAutoActionEnabled] = useState(false)
    const isMyGo = useAppSelector(getIsMyGo)
    const iamSpectator = useAppSelector(getIamSpectator)
    const playerProfiles = useAppSelector(getPlayerProfiles)
    const { enqueueSnackbar } = useSnackbar()

    // Enable the auto action manager after a delay if it isn't already active
    useEffect(() => {
        setTimeout(() => {
            if (!autoActionEnabled) setAutoActionEnabled(true)
        }, 2000)
    }, [autoActionEnabled])

    const handleWebsocketMessage = (message: string) => {
        const payload = JSON.parse(message)
        const actionEvent = JSON.parse(payload.payload) as ActionEvent

        processAction(actionEvent)

        // Only enable the auto action manager when we have successfully processed a message
        if (!autoActionEnabled) setAutoActionEnabled(true)
    }

    const sendCardsBoughtNotification = useCallback(
        (buyCardsEvt: BuyCardsEvent) => {
            const player = playerProfiles.find(
                p => p.id === buyCardsEvt.playerId,
            )
            if (player)
                enqueueSnackbar(`${player.name} bought ${buyCardsEvt.bought}`, {
                    variant: "info",
                })
        },
        [playerProfiles],
    )

    const reloadCards = (cards: CardName[], clearSelected = false) => {
        if (clearSelected) {
            dispatch(clearSelectedCards())
            dispatch(clearAutoPlay())
        }
        dispatch(updateMyCards(cards))
    }

    // On hand completion we need to display the last card to the user
    const processHandCompleted = async (
        game: GameState,
        previousRound: Round,
    ) => {
        dispatch(updateMyCards(game.cards))

        // Disable actions by setting isMyGo to false
        dispatch(disableActions())

        // Show the last card of the last round being played
        playCardSound()
        dispatch(updatePlayedCards(previousRound.currentHand.playedCards))
        await new Promise(r => setTimeout(r, 4000))

        // Finally update the game with the latest state
        dispatch(updateGame(game))
    }

    // On round completion we need to display the last round to the user
    const processRoundCompleted = async (
        game: GameState,
        previousRound?: Round,
    ) => {
        // Disable actions by setting isMyGo to false
        dispatch(disableActions())

        // Previous round will be undefined nobody called
        if (previousRound) {
            // Show the last card of the penultimate round being played
            playCardSound()
            const penultimateHand = previousRound.completedHands.pop()
            if (!penultimateHand)
                throw Error("Failed to get the penultimate round")
            dispatch(updatePlayedCards(penultimateHand.playedCards))
            await new Promise(r => setTimeout(r, 4000))

            // Next show the final round being played
            playCardSound()
            dispatch(updatePlayedCards(previousRound.currentHand.playedCards))
            dispatch(updateMyCards([]))
            await new Promise(r => setTimeout(r, 6000))
        } else {
            enqueueSnackbar("Nobody called. Redealing....", {
                variant: "info",
            })
            await new Promise(r => setTimeout(r, 2000))
        }

        // Finally update the game with the latest state
        shuffleSound()
        dispatch(updateGame(game))
        dispatch(updateMyCards(game.cards))
    }

    // On game completion we need to display the last round to the user
    const processGameCompleted = async (
        game: GameState,
        previousRound: Round,
    ) => {
        // Disable actions by setting isMyGo to false
        dispatch(disableActions())

        // Show the last card of the penultimate round being played
        playCardSound()
        const penultimateHand = previousRound.completedHands.pop()
        if (!penultimateHand) throw Error("Failed to get the penultimate round")
        dispatch(updatePlayedCards(penultimateHand.playedCards))
        await new Promise(r => setTimeout(r, 4000))

        // Next show the final round being played
        playCardSound()
        dispatch(updatePlayedCards(previousRound.currentHand.playedCards))
        dispatch(updateMyCards([]))
        await new Promise(r => setTimeout(r, 6000))

        // Finally update the game with the latest state
        dispatch(updateGame(game))
    }

    const processAction = useCallback(
        async (action: ActionEvent) => {
            console.log(action.type)
            switch (action.type) {
                case "HAND_COMPLETED":
                    await processHandCompleted(
                        action.gameState,
                        action.transitionData as Round,
                    )
                    break
                case "ROUND_COMPLETED":
                    await processRoundCompleted(
                        action.gameState,
                        action.transitionData
                            ? (action.transitionData as Round)
                            : undefined,
                    )
                    break
                case "BUY_CARDS":
                    const buyCardsEvt = action.transitionData as BuyCardsEvent
                    sendCardsBoughtNotification(buyCardsEvt)
                    if (!iamSpectator)
                        reloadCards(action.gameState.cards, isMyGo)
                    dispatch(updateGame(action.gameState))
                    break
                case "CHOOSE_FROM_DUMMY":
                case "CARD_PLAYED":
                    playCardSound()
                    if (!iamSpectator)
                        reloadCards(action.gameState.cards, isMyGo)
                    dispatch(updateGame(action.gameState))
                    break
                case "CALL":
                    callSound()
                    if (!iamSpectator) reloadCards(action.gameState.cards, true)
                    dispatch(updateGame(action.gameState))
                    break
                case "PASS":
                    passSound()
                    if (!iamSpectator) reloadCards(action.gameState.cards, true)
                    dispatch(updateGame(action.gameState))
                    break

                case "REPLAY":
                    dispatch(updateGame(action.gameState))
                    break
                case "GAME_OVER":
                    await processGameCompleted(
                        action.gameState,
                        action.transitionData as Round,
                    )
            }
        },
        [playerProfiles, iamSpectator, isMyGo],
    )

    useSubscription(["/game", "/user/game"], message =>
        handleWebsocketMessage(message.body),
    )

    return <>{autoActionEnabled && <AutoActionManager />}</>
}

const WebsocketManager = () => {
    const gameId = useAppSelector(getGameId)
    const accessToken = useAppSelector(getAccessToken)

    if (!gameId) return null

    return (
        <StompSessionProvider
            url={`${process.env.REACT_APP_WEBSOCKET_URL}/websocket?gameId=${gameId}&tokenId=${accessToken}`}>
            <WebsocketHandler />
        </StompSessionProvider>
    )
}

export default WebsocketManager
