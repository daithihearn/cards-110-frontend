import React, { useState } from 'react';

import {
    StompSessionProvider,
    useSubscription
  } from "react-stomp-hooks"

import { useDispatch, useSelector } from 'react-redux'

import auth0Client from '../../Auth'

import shuffleAudio from '../../assets/sounds/shuffle.ogg'
import playCardAudio from '../../assets/sounds/play_card.ogg'
import alertAudio from '../../assets/sounds/alert.ogg'

const WebsocketHandler = () => {

    const dispatch = useDispatch()
    const isMyGo = useSelector(state => state.game.game.myGo)
    const [previousAction, updatePreviousAction] = useState("")

    const handleWebsocketMessage = (message) => {

        if(previousAction === "LAST_CARD_PLAYED") {
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
        processActons(publishContent.type)

        if (publishContent.type !== "BUY_CARDS_NOTIFICATION") {
            updateGame(publishContent.content)
        }
    }

    const updateGame = (game) => {
        dispatch({ type: 'game/updateGame', payload: game })
    }

    const shuffleSound = new Audio(shuffleAudio)
    const playCardSound = new Audio(playCardAudio)
    const alertSound = new Audio(alertAudio)

    const playShuffleSound = () => {
        shuffleSound.play().then(_ => {
            console.log("Shuffle sound played!")
        }).catch(error => {
            console.log("Error playing shuffle sound!")
        });
    }

    const playPlayCardSound = () => {
        playCardSound.play().then(_ => {
            console.log("Play card sound played!")
        }).catch(error => {
            console.log("Error playing play card sound!")
        });
    }

    const playAlertSound = () => {
        alertSound.play().then(_ => {
            console.log("Alert sound played!")
        }).catch(error => {
            console.log("Error playing alert sound!")
        });
    }

    const checkClearSelected = () => {
        // If I played the card clear the selected cards
        if (isMyGo) {
            dispatch({ type: 'game/clearSelectedCards' })
        }
    }

    const setAlert = () => {
        let thisObj = this;
        let stateDelta = { activeAlert: uuid() };
        sleep(10000).then(() => {
            if (!!thisObj.state.activeAlert && thisObj.state.activeAlert === stateDelta.activeAlert) {
                playAlertSound();
                let stateUpdate = thisObj.state;
                Object.assign(stateUpdate, thisObj.cancelAlert());
                thisObj.setState(stateUpdate);
            }
        });

        return stateDelta;
    }

    const cancelAlert = () => {
        if (!!this.state.activeAlert) {
            return { activeAlert: null };
        }
    }

    const processActons = (type) => {
        switch (type) {
            case ("DEAL"):
                playShuffleSound();
                break;
            case ("LAST_CARD_PLAYED"):
            case ("CARD_PLAYED"):
                playPlayCardSound()
                checkClearSelected()
                break;
            case ("REPLAY"):
                break;
            case ("GAME_OVER"):
                break;
            case ("BUY_CARDS"):
                break;
            case ("BUY_CARDS_NOTIFICATION"):
                break;
            case ("HAND_COMPLETED"):
                break;
            case ("ROUND_COMPLETED"):
                break;
            case ("CALL"):
                break;
            case ("CHOOSE_FROM_DUMMY"):
                break;
        }
    }
    
    useSubscription(["/game", "/user/game"], (message) => handleWebsocketMessage(message.body))

    return null
}

const WebsocketManager = () => {

    const gameId = useSelector(state => state.game.game.id)

    console.log("Is this happening often?")
    
    return (
        <StompSessionProvider url={`${process.env.REACT_APP_WEBSOCKET_URL}/websocket?gameId=${gameId}&tokenId=${auth0Client.getAccessToken()}`}>
            <WebsocketHandler />
        </StompSessionProvider>
    )
}

export default WebsocketManager
