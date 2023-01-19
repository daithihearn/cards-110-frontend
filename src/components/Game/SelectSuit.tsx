import { Button, ButtonGroup, CardBody } from "reactstrap"

import { useCallback, useState } from "react"

import GameService from "../../services/GameService"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getGameId, getIamGoer, getIsRoundCalled } from "../../caches/GameSlice"
import { Suit } from "../../model/Suit"
import { useSnackbar } from "notistack"
import {
    getMyCardsWithoutBlanks,
    getSelectedCards,
} from "../../caches/MyCardsSlice"
import { removeAllFromHand } from "../../utils/GameUtils"
import ThrowCardsWarningModal from "./ThrowCardsWarningModal"
import { SelectableCard } from "../../model/Cards"

const SelectSuit = () => {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const iamGoer = useAppSelector(getIamGoer)
    const isCalled = useAppSelector(getIsRoundCalled)

    const [selectedSuit, setSelectedSuit] = useState<Suit>()
    const [possibleIssue, setPossibleIssues] = useState(false)

    const selectedCards = useAppSelector(getSelectedCards)

    const selectFromDummy = useCallback(
        (suit: Suit) => {
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
                setPossibleIssues(true)
            } else {
                dispatch(
                    GameService.chooseFromDummy(gameId!, selectedCards, suit),
                ).catch((e: Error) =>
                    enqueueSnackbar(e.message, { variant: "error" }),
                )
            }
        },
        [gameId, selectedCards],
    )

    const selectFromDummyCallback = (
        id: string,
        sel: SelectableCard[],
        suit?: Suit,
    ) => {
        if (!suit) throw Error("Must provide a suit")
        dispatch(GameService.chooseFromDummy(id, sel, suit)).catch((e: Error) =>
            enqueueSnackbar(e.message, { variant: "error" }),
        )
    }

    const hideCancelSelectFromDummyDialog = useCallback(() => {
        setSelectedSuit(undefined)
        setPossibleIssues(false)
    }, [])

    const riskOfMistakeBuyingCards = useCallback(
        (suit: Suit) => {
            let deletingCards = removeAllFromHand(selectedCards, myCards)

            for (const element of deletingCards) {
                if (
                    element.name === "JOKER" ||
                    element.name === "ACE_HEARTS" ||
                    element.suit === suit
                ) {
                    return true
                }
            }

            return false
        },
        [myCards, selectedCards],
    )

    return (
        <div>
            {isCalled ? (
                <CardBody className="buttonArea">
                    {iamGoer ? (
                        <div>
                            <ButtonGroup size="lg">
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() =>
                                        selectFromDummy(Suit.HEARTS)
                                    }>
                                    <img
                                        alt="Hearts"
                                        src={"/cards/originals/HEARTS_ICON.svg"}
                                        className="thumbnail_size_extra_small "
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() =>
                                        selectFromDummy(Suit.DIAMONDS)
                                    }>
                                    <img
                                        alt="Hearts"
                                        src={
                                            "/cards/originals/DIAMONDS_ICON.svg"
                                        }
                                        className="thumbnail_size_extra_small "
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() =>
                                        selectFromDummy(Suit.SPADES)
                                    }>
                                    <img
                                        alt="Hearts"
                                        src={"/cards/originals/SPADES_ICON.svg"}
                                        className="thumbnail_size_extra_small "
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() => selectFromDummy(Suit.CLUBS)}>
                                    <img
                                        alt="Hearts"
                                        src={"/cards/originals/CLUBS_ICON.svg"}
                                        className="thumbnail_size_extra_small "
                                    />
                                </Button>
                            </ButtonGroup>

                            {selectedSuit && (
                                <ThrowCardsWarningModal
                                    modalVisible={possibleIssue}
                                    cancelCallback={
                                        hideCancelSelectFromDummyDialog
                                    }
                                    continueCallback={selectFromDummyCallback}
                                    suit={selectedSuit}
                                />
                            )}
                        </div>
                    ) : (
                        <ButtonGroup size="lg">
                            <Button disabled type="button" color="primary">
                                Please wait for the goer to choose their suit
                            </Button>
                        </ButtonGroup>
                    )}
                </CardBody>
            ) : null}
        </div>
    )
}

export default SelectSuit
