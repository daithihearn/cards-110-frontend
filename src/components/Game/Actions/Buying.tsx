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
    getNumPlayers,
    getIamGoer,
    getIHavePlayed,
    getIsMyGo,
    getSuit,
} from "caches/GameSlice"
import { pickBestCards, riskOfMistakeBuyingCards } from "utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { SelectableCard } from "model/Cards"
import parseError from "utils/ErrorUtils"
import { Button } from "@mui/material"
import { getSettings } from "caches/SettingsSlice"

const WaitingForRoundToStart = () => (
    <Button variant="contained" disableRipple color="primary">
        <b>Waiting for round to start...</b>
    </Button>
)

const Buying = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const settings = useAppSelector(getSettings)
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
        (sel: SelectableCard[]) => {
            if (!gameId) return
            dispatch(GameService.buyCards(gameId, sel)).catch((e: Error) =>
                enqueueSnackbar(parseError(e), { variant: "error" }),
            )
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
        if (!isMyGo || !suit) return
        if (readyToBuy) {
            if (riskOfMistakeBuyingCards(suit, selectedCards, myCards)) {
                updateDeleteCardsDialog(true)
            } else buyCards(selectedCards)
        }
    }, [iamGoer, suit, selectedCards, myCards, isMyGo, readyToBuy])

    if (iHavePlayed || settings.autoBuyCards) return <WaitingForRoundToStart />
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
