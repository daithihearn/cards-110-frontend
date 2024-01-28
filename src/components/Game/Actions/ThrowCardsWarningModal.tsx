import React, { useCallback, useMemo } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    ButtonGroup,
    Card as MuiCard,
    CardMedia,
    CardContent,
} from "@mui/material"
import { useAppSelector } from "caches/hooks"
import { Card } from "model/Cards"
import { Suit } from "model/Suit"
import { getTrumpCards, removeAllFromHand } from "utils/GameUtils"
import { getCardsWithoutBlanks, getSelectedCards } from "caches/GameSlice"

interface ModalOpts {
    modalVisible: boolean
    cancelCallback: () => void
    continueCallback: (sel: Card[], suit?: Suit) => void
    suit: Suit
}

const ThrowCardsWarningModal: React.FC<ModalOpts> = ({
    modalVisible,
    cancelCallback,
    continueCallback,
    suit,
}) => {
    const myCards = useAppSelector(getCardsWithoutBlanks)
    const selectedCards = useAppSelector(getSelectedCards)

    const cardsToBeThrown = useMemo(
        () => getTrumpCards(removeAllFromHand(selectedCards, myCards), suit),
        [myCards, selectedCards],
    )

    const callContinue = useCallback(() => {
        continueCallback(selectedCards, suit)
    }, [selectedCards])

    return (
        <Dialog onClose={() => cancelCallback()} open={modalVisible}>
            <DialogTitle>
                <CardMedia
                    component="img"
                    alt="Suit"
                    image={`/cards/originals/${suit}_ICON.svg`}
                    className="thumbnail-size-extra-small left-padding"
                />
                Are you sure you want to throw these cards away?
            </DialogTitle>
            <DialogContent className="called-modal">
                <MuiCard className="gameModalCardGroup">
                    <CardContent className="card-area">
                        {cardsToBeThrown.map(card => (
                            <img
                                key={`deleteCardModal_${card.name}`}
                                alt={card.name}
                                src={`/cards/thumbnails/${card.name}.png`}
                                className="thumbnail-size"
                            />
                        ))}
                    </CardContent>

                    <CardContent className="button-area">
                        <ButtonGroup size="large">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => cancelCallback()}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={callContinue}>
                                Throw Cards
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </MuiCard>
            </DialogContent>
        </Dialog>
    )
}

export default ThrowCardsWarningModal
