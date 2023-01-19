import { useSnackbar } from "notistack"
import React, { useCallback, useMemo } from "react"
import {
    Modal,
    ModalBody,
    ModalHeader,
    Button,
    ButtonGroup,
    CardImg,
    CardBody,
    CardGroup,
    Card as CardComponent,
} from "reactstrap"
import { getGameId } from "../../caches/GameSlice"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
    getMyCardsWithoutBlanks,
    getSelectedCards,
} from "../../caches/MyCardsSlice"
import { Card, SelectableCard } from "../../model/Cards"
import { Suit } from "../../model/Suit"
import GameService from "../../services/GameService"
import { removeAllFromHand } from "../../utils/GameUtils"

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
        <Modal
            fade={true}
            size="lg"
            toggle={() => cancelCallback()}
            isOpen={modalVisible}>
            <ModalHeader>
                <CardImg
                    alt="Suit"
                    src={`/cards/originals/${suit}_ICON.svg`}
                    className="thumbnail_size_extra_small left-padding"
                />
                Are you sure you want to throw these cards away?
            </ModalHeader>
            <ModalBody className="called-modal">
                <CardGroup className="gameModalCardGroup">
                    <CardComponent className="p-6">
                        <CardBody className="cardArea">
                            {cardsToBeThrown.map(card => (
                                <img
                                    key={`deleteCardModal_${card.name}`}
                                    alt={card.name}
                                    src={`/cards/thumbnails/${card.name}.png`}
                                    className="thumbnail_size"
                                />
                            ))}
                        </CardBody>

                        <CardBody className="buttonArea">
                            <ButtonGroup size="lg">
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={() => cancelCallback()}>
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    color="warning"
                                    onClick={callContinue}>
                                    Throw Cards
                                </Button>
                            </ButtonGroup>
                        </CardBody>
                    </CardComponent>
                </CardGroup>
            </ModalBody>
        </Modal>
    )
}

export default ThrowCardsWarningModal
