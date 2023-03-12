import { Button } from "reactstrap"

import { useCallback, useEffect, useState } from "react"

import GameService from "services/GameService"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { useSnackbar } from "notistack"
import {
    getMyCardsWithoutBlanks,
    getSelectedCards,
    selectAll,
} from "caches/MyCardsSlice"
import {
    getGameId,
    getIamGoer,
    getIHavePlayed,
    getIsMyGo,
    getSuit,
} from "caches/GameSlice"
import { riskOfMistakeBuyingCards } from "utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { SelectableCard } from "model/Cards"
import parseError from "utils/ErrorUtils"

const WaitingForRoundToStart = () => (
    <Button disabled type="button" color="info">
        <b>Waiting for round to start...</b>
    </Button>
)

const Buying = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
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

    const buyCards = (id: string, sel: SelectableCard[]) => {
        dispatch(GameService.buyCards(id, sel)).catch(e =>
            enqueueSnackbar(parseError(e), { variant: "error" }),
        )
    }

    const hideCancelDeleteCardsDialog = useCallback(() => {
        updateDeleteCardsDialog(false)
    }, [])

    useEffect(() => {
        if (iamGoer) {
            dispatch(selectAll())
            setReadyToBuy(true)
        }
    }, [iamGoer])

    useEffect(() => {
        if (isMyGo && readyToBuy) {
            if (!gameId) throw Error("No game id set")

            if (riskOfMistakeBuyingCards(suit!, selectedCards, myCards)) {
                setReadyToBuy(false)
                updateDeleteCardsDialog(true)
            } else buyCards(gameId, selectedCards)
        }
    }, [gameId, suit, selectedCards, myCards, isMyGo, readyToBuy])

    if (iHavePlayed) return <WaitingForRoundToStart />
    return (
        <>
            <Button
                type="button"
                onClick={toggleReadyToBuy}
                color={isMyGo || !readyToBuy ? "primary" : "secondary"}>
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
