import { useCallback, useState } from "react"

import { useAppSelector } from "caches/hooks"
import {
    getGameId,
    getIHavePlayed,
    getIamGoer,
    getIsMyGo,
    getSelectedCards,
    getSuit,
} from "caches/GameSlice"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { Button } from "@mui/material"
import { useGameActions } from "components/Hooks/useGameActions"
import { useSettings } from "components/Hooks/useSettings"

const WaitingForRoundToStart = () => (
    <Button variant="contained" disableRipple color="primary">
        <b>Waiting for round to start...</b>
    </Button>
)

const Buying = () => {
    const { buyCards } = useGameActions()
    const { settings } = useSettings()
    const gameId = useAppSelector(getGameId)
    const suit = useAppSelector(getSuit)
    const isMyGo = useAppSelector(getIsMyGo)
    const iHavePlayed = useAppSelector(getIHavePlayed)
    const iamGoer = useAppSelector(getIamGoer)

    const [deleteCardsDialog, setDeleteCardsDialog] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const buyCardsWrapper = useCallback(() => {
        if (!gameId) return
        buyCards({
            gameId,
            cards: selectedCards.map(c => (typeof c === "string" ? c : c.name)),
        })
    }, [gameId, selectedCards])

    const hideCancelDeleteCardsDialog = useCallback(() => {
        setDeleteCardsDialog(false)
    }, [])

    if (iHavePlayed || settings?.autoBuyCards || iamGoer)
        return <WaitingForRoundToStart />
    return (
        <>
            <Button type="button" onClick={buyCardsWrapper} color="primary">
                <b>{isMyGo ? "Keep Cards" : "Waiting to buy cards..."}</b>
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
