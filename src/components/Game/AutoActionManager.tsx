import { useEffect } from "react"
import GameService from "../../services/GameService"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
    getCanBuyCards,
    getCards,
    getGameId,
    getIsInBunker,
    getIsMyGo,
    getRound,
} from "../../caches/GameSlice"
import { RoundStatus } from "../../model/Round"
import { getAutoPlayCard } from "../../caches/AutoPlaySlice"
import { bestCardLead, getWorstCard } from "../../utils/GameUtils"
import { useSnackbar } from "notistack"
import parseError from "../../utils/ErrorUtils"

const AutoActionManager = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const gameId = useAppSelector(getGameId)
    const round = useAppSelector(getRound)
    const cards = useAppSelector(getCards)

    const autoPlayCard = useAppSelector(getAutoPlayCard)

    const canBuyCards = useAppSelector(getCanBuyCards)
    const isMyGo = useAppSelector(getIsMyGo)
    const isInBunker = useAppSelector(getIsInBunker)

    const playCard = (id: string, card: string, suppressError = false) =>
        dispatch(GameService.playCard(id, card)).catch(e => {
            if (!suppressError)
                enqueueSnackbar(parseError(e), {
                    variant: "error",
                })
            else console.error(e)
        })

    const call = (id: string, callAmount: number) =>
        dispatch(GameService.call(id, callAmount)).catch(console.error)

    const buyCards = (gameId: string, cardsToBuy: string[]) =>
        dispatch(GameService.buyCards(gameId, cardsToBuy)).catch(console.error)

    // If in the bunker, Pass
    useEffect(() => {
        if (gameId && isInBunker) call(gameId, 0)
    }, [gameId, isInBunker])

    // 1. Play card when you've pre-selected a card
    // 2. Play worst card if best card lead out
    useEffect(() => {
        if (
            gameId &&
            isMyGo &&
            round?.suit &&
            round.status === RoundStatus.PLAYING
        ) {
            if (autoPlayCard) playCard(gameId, autoPlayCard, true)
            else if (bestCardLead(round)) {
                const cardToPlay = getWorstCard(cards, round.suit)
                if (cardToPlay) playCard(gameId, cardToPlay.name, true)
            }
        }
    }, [gameId, round, isMyGo, cards, autoPlayCard])

    // Buy cards in if you are the goer
    useEffect(() => {
        if (gameId && canBuyCards) buyCards(gameId, cards)
    }, [gameId, cards, canBuyCards])

    return null
}

export default AutoActionManager
