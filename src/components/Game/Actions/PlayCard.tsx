import { Button } from "reactstrap"

import { useCallback, useMemo } from "react"

import GameService from "services/GameService"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { useSnackbar } from "notistack"
import { getMyCardsWithoutBlanks, getSelectedCards } from "caches/MyCardsSlice"
import { getGameId, getIsMyGo, getRound } from "caches/GameSlice"
import { BLANK_CARD } from "model/Cards"
import parseError from "utils/ErrorUtils"
import { RoundStatus } from "model/Round"

const WaitingForYourTurn = () => (
    <Button disabled type="button" color="info">
        <b>Waiting for your turn...</b>
    </Button>
)

const PlayCard = () => {
    const dispatch = useAppDispatch()
    const round = useAppSelector(getRound)
    const { enqueueSnackbar } = useSnackbar()
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const isMyGo = useAppSelector(getIsMyGo)
    const selectedCards = useAppSelector(getSelectedCards)

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

    const playCard = useCallback(() => {
        if (selectedCards.length !== 1) {
            enqueueSnackbar("Please select exactly one card to play", {
                variant: "warning",
            })
        } else {
            dispatch(
                GameService.playCard(gameId!, selectedCards[0].name),
            ).catch(e => enqueueSnackbar(parseError(e), { variant: "error" }))
        }
    }, [gameId, selectedCards])

    if (!playButtonEnabled) return <WaitingForYourTurn />
    return (
        <Button
            id="playCardButton"
            type="button"
            onClick={playCard}
            color="primary">
            <b>Play Card</b>
        </Button>
    )
}

export default PlayCard
