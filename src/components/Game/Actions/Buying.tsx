import { useCallback, useState } from "react"

import { useAppSelector } from "caches/hooks"
import {
    getGameId,
    getIsMyGo,
    getSelectedCards,
    getSuit,
} from "caches/GameSlice"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { Button } from "@mui/material"
import { useGameActions } from "components/Hooks/useGameActions"

const Buying = () => {
    const { buyCards } = useGameActions()

    const gameId = useAppSelector(getGameId)
    const suit = useAppSelector(getSuit)
    const isMyGo = useAppSelector(getIsMyGo)

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
