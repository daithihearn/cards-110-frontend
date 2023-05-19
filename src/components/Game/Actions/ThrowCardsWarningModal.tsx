import React, { useCallback, useMemo } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    ButtonGroup,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material"
import { getGameId } from "caches/GameSlice"
import { useAppSelector } from "caches/hooks"
import { getMyCardsWithoutBlanks, getSelectedCards } from "caches/MyCardsSlice"
import { SelectableCard } from "model/Cards"
import { Suit } from "model/Suit"
import { removeAllFromHand } from "utils/GameUtils"

interface ModalOpts {
    modalVisible: boolean
    cancelCallback: () => void
    continueCallback: (id: string, sel: SelectableCard[], suit?: Suit) => void
    suit: Suit
}

const ThrowCardsWarningModal: React.FC<ModalOpts> = ({
    modalVisible,
    cancelCallback,
    continueCallback,
    suit,
}) => {
    const gameId = useAppSelector(getGameId)
    const myCards = useAppSelector(getMyCardsWithoutBlanks)
    const selectedCards = useAppSelector(getSelectedCards)

    const cardsToBeThrown = useMemo(
        () => removeAllFromHand(selectedCards, myCards),
        [myCards, selectedCards],
    )

    const callContinue = useCallback(() => {
        if (!gameId) throw Error("GameId not set")
        continueCallback(gameId, selectedCards, suit)
    }, [gameId, selectedCards])

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
                <Card className="gameModalCardGroup">
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
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default ThrowCardsWarningModal
