import { useCallback, useEffect, useState } from "react"

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
import { Card, CardName } from "model/Cards"
import { Button } from "@mui/material"
import { useSettings } from "components/Hooks/useSettings"
import { useGameActions } from "components/Hooks/useGameActions"

const WaitingForRoundToStart = () => (
    <Button variant="contained" disableRipple color="primary">
        <b>Waiting for round to start...</b>
    </Button>
)

const Buying = () => {
    const dispatch = useAppDispatch()
    const { buyCards } = useGameActions()
    const { settings } = useSettings()

    const numPlayers = useAppSelector(getNumPlayers)
    const gameId = useAppSelector(getGameId)
    const suit = useAppSelector(getSuit)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const [readyToBuy, setReadyToBuy] = useState(false)
    const iHavePlayed = useAppSelector(getIHavePlayed)
    const isMyGo = useAppSelector(getIsMyGo)
    const iamGoer = useAppSelector(getIamGoer)

    const [deleteCardsDialog, setDeleteCardsDialog] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const toggleReadyToBuy = useCallback(() => {
        setReadyToBuy(!readyToBuy)
    }, [readyToBuy])

    const buyCardsWrapper = useCallback(
        (sel: CardName[] | Card[]) => {
            if (!gameId) return
            buyCards({
                gameId,
                cards: sel.map(c => (typeof c === "string" ? c : c.name)),
            })
        },
        [gameId],
    )

    const hideCancelDeleteCardsDialog = useCallback(() => {
        setDeleteCardsDialog(false)
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
        if (!isMyGo || !suit || !gameId) return
        // 2. If I am the goer and it is my go then keep all cards
        else if (iamGoer) {
            buyCards({ gameId, cards: myCards.map(c => c.name) })
        }
        // 3. If I am not the goer and it is my go and I have enabled auto buy cards then keep best cards
        else if (!iamGoer && settings?.autoBuyCards) {
            buyCards({
                gameId,
                cards: pickBestCards(myCards, suit, numPlayers).map(
                    c => c.name,
                ),
            })
        }
        // 4. If I am not the goer and it is my go and I am ready to buy then keep selected cards
        else if (!iamGoer && readyToBuy) {
            if (riskOfMistakeBuyingCards(suit, selectedCards, myCards)) {
                setDeleteCardsDialog(true)
            } else buyCardsWrapper(selectedCards)
        }
    }, [
        settings,
        gameId,
        iamGoer,
        suit,
        selectedCards,
        myCards,
        isMyGo,
        numPlayers,
        readyToBuy,
    ])

    if (iHavePlayed || settings?.autoBuyCards || iamGoer)
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

            {suit && (
                <ThrowCardsWarningModal
                    modalVisible={deleteCardsDialog}
                    cancelCallback={hideCancelDeleteCardsDialog}
                    continueCallback={buyCardsWrapper}
                    suit={suit}
                />
            )}
        </>
    )
}

export default Buying
