import { useEffect } from "react"
import GameService from "../../services/GameService"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
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

    const isMyGo = useAppSelector(getIsMyGo)
    const isInBunker = useAppSelector(getIsInBunker)

    const playCard = (id: string, card: string) =>
        dispatch(GameService.playCard(id, card)).catch(e => {
            enqueueSnackbar(parseError(e), {
                variant: "error",
            })
        })

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

    return null
}

export default AutoActionManager
