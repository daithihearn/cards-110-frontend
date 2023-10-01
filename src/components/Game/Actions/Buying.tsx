import { useCallback, useEffect, useState } from "react"

import GameService from "services/GameService"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import {
    getMyCardsWithoutBlanks,
    getSelectedCards,
    selectAll,
} from "caches/MyCardsSlice"
import {
    getGameId,
    getNumPlayers,
    getIamGoer,
    getIHavePlayed,
    getIsMyGo,
    getSuit,
} from "caches/GameSlice"
import { pickBestCards, riskOfMistakeBuyingCards } from "utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { Card } from "model/Cards"
import { Button } from "@mui/material"
import { getSettings } from "caches/SettingsSlice"

const WaitingForRoundToStart = () => (
    <Button variant="contained" disableRipple color="primary">
        <b>Waiting for round to start...</b>
    </Button>
)

const Buying = () => {
    const dispatch = useAppDispatch()
    const settings = useAppSelector(getSettings)
    const numPlayers = useAppSelector(getNumPlayers)
    const gameId = useAppSelector(getGameId)
    const suit = useAppSelector(getSuit)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const [readyToBuy, setReadyToBuy] = useState(false)
    const iHavePlayed = useAppSelector(getIHavePlayed)
    const isMyGo = useAppSelector(getIsMyGo)
    const iamGoer = useAppSelector(getIamGoer)

    const [deleteCardsDialog, updateDeleteCardsDialog] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const toggleReadyToBuy = useCallback(() => {
        setReadyToBuy(!readyToBuy)
    }, [readyToBuy])

    const buyCards = useCallback(
        (sel: Card[]) => {
            if (!gameId) return
            dispatch(GameService.buyCards(gameId, sel)).catch(console.error)
        },
        [gameId],
    )

    const hideCancelDeleteCardsDialog = useCallback(() => {
        updateDeleteCardsDialog(false)
        setReadyToBuy(false)
    }, [])

    useEffect(() => {
        if (iamGoer) {
            dispatch(selectAll())
            setReadyToBuy(true)
        }
    }, [iamGoer])

    useEffect(() => {
        // 1. If it is not my go then do nothing
        if (!isMyGo || !suit) return
        // 2. If I am the goer and it is my go then keep all cards
        else if (iamGoer) {
            buyCards(myCards)
        }
        // 3. If I am not the goer and it is my go and I have enabled auto buy cards then keep best cards
        else if (!iamGoer && settings.autoBuyCards) {
            buyCards(pickBestCards(myCards, suit, numPlayers))
        }
        // 4. If I am not the goer and it is my go and I am ready to buy then keep selected cards
        else if (!iamGoer && readyToBuy) {
            if (riskOfMistakeBuyingCards(suit, selectedCards, myCards)) {
                updateDeleteCardsDialog(true)
            } else buyCards(selectedCards)
        }
    }, [
        settings,
        iamGoer,
        suit,
        selectedCards,
        myCards,
        isMyGo,
        numPlayers,
        readyToBuy,
    ])

    if (iHavePlayed || settings.autoBuyCards || iamGoer)
        return <WaitingForRoundToStart />
    return (
        <>
            <Button type="button" onClick={toggleReadyToBuy} color="primary">
                <b>
                    {isMyGo || !readyToBuy
                        ? "Keep Cards"
                        : "Waiting to buy cards..."}
                </b>
            </Button>

            <ThrowCardsWarningModal
                modalVisible={deleteCardsDialog}
                cancelCallback={hideCancelDeleteCardsDialog}
                continueCallback={buyCards}
                suit={suit!}
            />
        </>
    )
}

export default Buying
