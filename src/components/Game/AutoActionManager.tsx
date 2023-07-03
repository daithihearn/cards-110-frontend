import { useCallback, useEffect } from "react"
import GameService from "services/GameService"

import { useAppDispatch, useAppSelector } from "caches/hooks"
import {
    getCards,
    getGameId,
    getIamGoer,
    getIsInBunker,
    getIsMyGo,
    getNumPlayers,
    getRound,
    getSuit,
} from "caches/GameSlice"
import { RoundStatus } from "model/Round"
import { getAutoPlayCard } from "caches/AutoPlaySlice"
import { bestCardLead, getWorstCard, pickBestCards } from "utils/GameUtils"
import { useSnackbar } from "notistack"
import parseError from "utils/ErrorUtils"
import { getSettings } from "caches/SettingsSlice"
import { SelectableCard } from "model/Cards"
import { getMyCardsWithoutBlanks } from "caches/MyCardsSlice"

const AutoActionManager = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const settings = useAppSelector(getSettings)
    const numPlayers = useAppSelector(getNumPlayers)
    const suit = useAppSelector(getSuit)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const gameId = useAppSelector(getGameId)
    const round = useAppSelector(getRound)
    const cards = useAppSelector(getCards)
    const iamGoer = useAppSelector(getIamGoer)

    const autoPlayCard = useAppSelector(getAutoPlayCard)

    const isMyGo = useAppSelector(getIsMyGo)
    const isInBunker = useAppSelector(getIsInBunker)

    const playCard = (id: string, card: string) =>
        dispatch(GameService.playCard(id, card)).catch(e => {
            enqueueSnackbar(parseError(e), {
                variant: "error",
            })
        })

    const buyCards = useCallback(
        (sel: SelectableCard[]) => {
            if (!gameId) return
            dispatch(GameService.buyCards(gameId, sel)).catch((e: Error) =>
                enqueueSnackbar(parseError(e), { variant: "error" }),
            )
        },
        [gameId],
    )

    const call = (id: string, callAmount: number) =>
        dispatch(GameService.call(id, callAmount)).catch(console.error)

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
            if (autoPlayCard) playCard(gameId, autoPlayCard)
            else if (bestCardLead(round)) {
                const cardToPlay = getWorstCard(cards, round.suit)
                if (cardToPlay) playCard(gameId, cardToPlay.name)
            }
        }
    }, [gameId, round, isMyGo, cards, autoPlayCard])

    // Auto buy cards
    useEffect(() => {
        if (
            settings.autoBuyCards &&
            suit &&
            isMyGo &&
            round?.status === RoundStatus.BUYING &&
            !iamGoer
        ) {
            buyCards(pickBestCards(myCards, suit, numPlayers))
        }
    }, [settings, isMyGo, iamGoer, round, myCards, suit, numPlayers])

    return null
}

export default AutoActionManager
