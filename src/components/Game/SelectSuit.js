
import { useSelector, useDispatch } from 'react-redux'
import { Modal, ModalBody, ModalHeader, Button, ButtonGroup, Card, CardImg, CardBody, CardGroup } from 'reactstrap'

import { useState } from 'react'
import parseError from '../../utils/ErrorUtils'

import gameService from '../../services/GameService'

const SelectSuit = () => {

    const dispatch = useDispatch()

    const game = useSelector(state => state.game.game)
    if (!game || !game.orderedCards) {
        return null
    }

    const selectedCards = game.orderedCards.filter(card => card.selected)

    // TODO: Need to move this up to the app state
    const [actionsDisabled, updateActionsDisabled] = useState(false)
    const [selectedSuit, updateSelectedSuit] = useState({ suit: "", possibleIssue: false})

    const selectFromDummy = (suit) => e => {
        if (actionsDisabled) {
            return;
        }

        // Make sure a suit was selected
        if (suit !== "HEARTS" && suit !== "DIAMONDS" && suit !== "CLUBS" && suit !== "SPADES") {
            dispatch({ type: 'snackbar/message', payload: { type: 'warning', message: "Please select a suit!" } })
            return;
        }

        // Check if there is a risk that they made a mistake when selecting the cards
        if (riskOfMistakeBuyingCards(suit)) {
            updateSelectedSuit({ suit: suit, possibleIssue: true })
            return;
        } else {
            submitSelectFromDummy(suit)
        }
    }

    const submitSelectFromDummyEvent = (suit) => e => {
        submitSelectFromDummy(suit)
    }

    const submitSelectFromDummy = (suit) => {
        dispatch({ type: 'game/disableActions' })
        gameService.chooseFromDummy(game.id, selectedCards.map(sc => sc.card), suit).catch(error => {
            dispatch({ type: 'game/enableActions' })
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
        dispatch({ type: 'game/clearSelectedCards' })
    }

    const hideCancelSelectFromDummyDialog = () => {
        updateSelectedSuit({ suit: "", possibleIssue: false })
    }

    const riskOfMistakeBuyingCards = (suit) => {

        let deletingCards = removeAllFromArray(selectedCards.map(sc => sc.card), game.cards)

        for (var i = 0; i < deletingCards.length; i++) {
            if (deletingCards[i] === "JOKER" || deletingCards[i] === "ACE_HEARTS" || deletingCards[i].split("_")[1] === suit) {
                return true
            }
        }

        return false
    }

    const removeAllFromArray = (toRemove, originalArray) => {

        let array = [...originalArray]
        toRemove.forEach(element => {
            array = removeFromArray(element, array)
        })
        return array
    }

    const removeFromArray = (elementValue, originalArray) => {

        let array = [...originalArray] // make a separate copy of the array
        let index = array.indexOf(elementValue)
        if (index !== -1) {
            array.splice(index, 1)
        }

        return array
    }

    return (
        <div>
            {!!game && !!game.round && game.iamGoer && game.round.status === "CALLED" ?

                <CardBody className="buttonArea">

                    <ButtonGroup size="lg">

                        <Button type="button" disabled={actionsDisabled} color="secondary" onClick={selectFromDummy("HEARTS")}><img alt="Hearts" src={"/cards/originals/HEARTS_ICON.svg"} className="thumbnail_size_extra_small " /></Button>
                        <Button type="button" disabled={actionsDisabled} color="secondary" onClick={selectFromDummy("DIAMONDS")}><img alt="Hearts" src={"/cards/originals/DIAMONDS_ICON.svg"} className="thumbnail_size_extra_small " /></Button>
                        <Button type="button" disabled={actionsDisabled} color="secondary" onClick={selectFromDummy("SPADES")}><img alt="Hearts" src={"/cards/originals/SPADES_ICON.svg"} className="thumbnail_size_extra_small " /></Button>
                        <Button type="button" disabled={actionsDisabled} color="secondary" onClick={selectFromDummy("CLUBS")}><img alt="Hearts" src={"/cards/originals/CLUBS_ICON.svg"} className="thumbnail_size_extra_small " /></Button>

                    </ButtonGroup>

                    {selectedSuit.possibleIssue ?
                        <Modal fade={true} size="lg" toggle={hideCancelSelectFromDummyDialog} isOpen={selectedSuit.possibleIssue}>

                            <ModalHeader><CardImg alt="Suit" src={`/cards/originals/${selectedSuit.suit}_ICON.svg`} className="thumbnail_size_extra_small left-padding" /> Are you sure you want to throw these cards away?</ModalHeader>
                            <ModalBody className="called-modal">
                                <CardGroup className="gameModalCardGroup">
                                    <Card className="p-6 tableCloth" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                                        <CardBody className="cardArea">

                                            {removeAllFromArray(selectedCards.map(sc => sc.card), game.cards).map(card =>
                                                <img key={"cancelSelectFromDummyModal_" + card} alt={card} src={"/cards/thumbnails/" + card + ".png"} className="thumbnail_size" />
                                            )}

                                        </CardBody>

                                        <CardBody className="buttonArea">

                                            <ButtonGroup size="lg">
                                                <Button type="button" color="primary" onClick={hideCancelSelectFromDummyDialog}>Cancel</Button>
                                                <Button type="button" color="warning" onClick={submitSelectFromDummyEvent(selectedSuit.suit)}>Throw Cards</Button>
                                            </ButtonGroup>

                                        </CardBody>
                                    </Card>
                                </CardGroup>
                            </ModalBody>
                        </Modal>
                        : null}

                </CardBody>
                : null}
        </div>
    )
}

export default SelectSuit