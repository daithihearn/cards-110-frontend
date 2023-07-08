import { useCallback, useEffect, useMemo, useState } from "react"

import GameService from "services/GameService"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { useSnackbar } from "notistack"
import { getMyCardsWithoutBlanks, getSelectedCards } from "caches/MyCardsSlice"
import { getGameId, getIsMyGo, getRound } from "caches/GameSlice"
import { BLANK_CARD } from "model/Cards"
import parseError from "utils/ErrorUtils"
import { RoundStatus } from "model/Round"
import { Button } from "@mui/material"
import { getCardToPlay, updateCardToPlay } from "caches/PlayCardSlice"
import { bestCardLead, getBestCard, getWorstCard } from "utils/GameUtils"

const WaitingForYourTurn = () => (
    <Button variant="contained" disableRipple color="secondary">
        <b>Wait for your turn...</b>
    </Button>
)

const PlayCard = () => {
    const dispatch = useAppDispatch()
    const round = useAppSelector(getRound)
    const { enqueueSnackbar } = useSnackbar()
    const [autoPlay, setAutoPlay] = useState(false)
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const isMyGo = useAppSelector(getIsMyGo)
    const selectedCards = useAppSelector(getSelectedCards)
    const cardToPlay = useAppSelector(getCardToPlay)

    const togglePlayCard = useCallback(() => setAutoPlay(!autoPlay), [autoPlay])

    const playButtonEnabled = useMemo(
        () =>
            isMyGo &&
            round &&
            round.status === RoundStatus.PLAYING &&
            round.completedHands.length +
                myCards.filter(c => c.name !== BLANK_CARD.name).length ===
                5,

        [isMyGo, round, myCards],
    )

    const playCard = useCallback(
        (card: string) =>
            dispatch(GameService.playCard(gameId!, card)).catch(e => {
                console.error(parseError(e))
            }),
        [gameId],
    )

    const selectCardToPlay = useCallback(() => {
        if (selectedCards.length === 1)
            dispatch(updateCardToPlay(selectedCards[0]))
    }, [selectedCards])

    // 1. Play card when you've pre-selected a card
    // 2. If auto play is enabled, play best card
    // 3. Play worst card if best card lead out
    useEffect(() => {
        if (round?.suit && isMyGo) {
            if (cardToPlay) playCard(cardToPlay)
            else if (autoPlay) {
                const bestCard = getBestCard(myCards, round.suit)
                playCard(bestCard.name)
            } else if (bestCardLead(round)) {
                const worstCard = getWorstCard(myCards, round.suit)
                playCard(worstCard.name)
            }
        }
    }, [playCard, autoPlay, round, isMyGo, myCards, cardToPlay])

    if (autoPlay) {
        return (
            <Button
                id="autoPlayCardButton"
                type="button"
                onClick={togglePlayCard}
                color="error">
                <b>Disable Auto Play</b>
            </Button>
        )
    } else if (!playButtonEnabled) return <WaitingForYourTurn />
    return (
        <>
            <Button
                id="playCardButton"
                type="button"
                onClick={selectCardToPlay}
                color="primary">
                <b>Play Card</b>
            </Button>

            <Button
                id="autoPlayCardButton"
                type="button"
                onClick={togglePlayCard}
                color="warning">
                <b>Enable Auto Play</b>
            </Button>
        </>
    )
}

export default PlayCard
