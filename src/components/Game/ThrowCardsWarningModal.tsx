import React, { useCallback } from "react"
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
import { Card } from "../../model/Cards"
import { Suit } from "../../model/Suit"

interface ModalOpts {
    modalVisible: boolean
    cancelCallback: () => void
    continueCallback: () => void
    suit: Suit
    cards: Card[]
}

const ThrowCardsWarningModal: React.FC<ModalOpts> = ({
    modalVisible,
    cancelCallback,
    continueCallback,
    suit,
    cards,
}) => {
    const callContinue = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>) => {
            event.preventDefault()
            continueCallback()
        },
        [],
    )
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
                />{" "}
                Are you sure you want to throw these cards away?
            </ModalHeader>
            <ModalBody className="called-modal">
                <CardGroup className="gameModalCardGroup">
                    <CardComponent
                        className="p-6 tableCloth"
                        style={{
                            backgroundColor: "#333",
                            borderColor: "#333",
                        }}>
                        <CardBody className="cardArea">
                            {cards.map(card => (
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
