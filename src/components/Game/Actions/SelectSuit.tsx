import { useCallback, useState } from "react"

import { Suit } from "model/Suit"
import { useSnackbar } from "notistack"
import { removeAllFromHand } from "utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { CardName, Card } from "model/Cards"
import { Button } from "@mui/material"
import { useAppSelector } from "caches/hooks"
import {
    getCardsWithoutBlanks,
    getGameId,
    getIamGoer,
    getSelectedCards,
} from "caches/GameSlice"
import { useGameActions } from "components/Hooks/useGameActions"

const WaitingForSuit = () => (
    <Button variant="contained" disableRipple color="primary">
        <b>Waiting for suit...</b>
    </Button>
)

const SelectSuit = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { selectSuit } = useGameActions()

    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getCardsWithoutBlanks)
    const iamGoer = useAppSelector(getIamGoer)

    const [selectedSuit, setSelectedSuit] = useState<Suit>()
    const [possibleIssue, setPossibleIssue] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const selectFromDummy = useCallback(
        (suit: Suit) => {
            if (!gameId) return
            // Make sure a suit was selected
            if (
                suit !== Suit.HEARTS &&
                suit !== Suit.DIAMONDS &&
                suit !== Suit.CLUBS &&
                suit !== Suit.SPADES
            ) {
                enqueueSnackbar("Please select a suit!")
                return
            }

            // Check if there is a risk that they made a mistake when selecting the cards
            if (riskOfMistakeBuyingCards(suit)) {
                setSelectedSuit(suit)
                setPossibleIssue(true)
            } else {
                selectSuit({ gameId, cards: selectedCards, suit })
            }
        },
        [gameId, selectedCards],
    )

    const selectFromDummyCallback = useCallback(() => {
        if (!gameId) return
        if (!selectedSuit) throw Error("Must provide a suit")

        selectSuit({ gameId, cards: selectedCards, suit: selectedSuit })
    }, [gameId, selectedCards, selectedSuit])

    const hideCancelSelectFromDummyDialog = useCallback(() => {
        setSelectedSuit(undefined)
        setPossibleIssue(false)
    }, [])

    const riskOfMistakeBuyingCards = useCallback(
        (suit: Suit) => {
            let deletingCards = removeAllFromHand(selectedCards, myCards)

            for (const element of deletingCards) {
                if (
                    element.name === CardName.JOKER ||
                    element.name === CardName.ACE_HEARTS ||
                    element.suit === suit
                ) {
                    return true
                }
            }

            return false
        },
        [myCards, selectedCards],
    )

    if (!iamGoer) return <WaitingForSuit />
    return (
        <>
            <Button
                type="button"
                color="primary"
                onClick={() => selectFromDummy(Suit.HEARTS)}>
                <img
                    alt="Hearts"
                    src={"/cards/originals/HEARTS_ICON.svg"}
                    className="thumbnail-size-extra-small "
                />
            </Button>
            <Button
                type="button"
                color="primary"
                onClick={() => selectFromDummy(Suit.DIAMONDS)}>
                <img
                    alt="Hearts"
                    src={"/cards/originals/DIAMONDS_ICON.svg"}
                    className="thumbnail-size-extra-small "
                />
            </Button>
            <Button
                type="button"
                color="primary"
                onClick={() => selectFromDummy(Suit.SPADES)}>
                <img
                    alt="Hearts"
                    src={"/cards/originals/SPADES_ICON.svg"}
                    className="thumbnail-size-extra-small "
                />
            </Button>
            <Button
                type="button"
                color="primary"
                onClick={() => selectFromDummy(Suit.CLUBS)}>
                <img
                    alt="Hearts"
                    src={"/cards/originals/CLUBS_ICON.svg"}
                    className="thumbnail-size-extra-small "
                />
            </Button>

            {selectedSuit && (
                <ThrowCardsWarningModal
                    modalVisible={possibleIssue}
                    cancelCallback={hideCancelSelectFromDummyDialog}
                    continueCallback={selectFromDummyCallback}
                    suit={selectedSuit}
                />
            )}
        </>
    )
}

export default SelectSuit
