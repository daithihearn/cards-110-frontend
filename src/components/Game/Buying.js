
import { useDispatch } from 'react-redux'
import { Modal, ModalBody, ModalHeader, Button, ButtonGroup, Form, Card, CardImg, CardBody, CardGroup } from 'reactstrap'

import { useState } from 'react'
import parseError from '../../utils/ErrorUtils'

import GameService from '../../services/GameService'
import { triggerBounceMessage } from '../../constants'

const Buying = (props) => {
    const game = props.game
    const orderedCards = props.orderedCards
    if (!game || !orderedCards) {
        return null
    }

    const dispatch = useDispatch()
    
    const selectedCards = orderedCards.filter(card => card.selected)

    const [deleteCardsDialog, updateDeleteCardsDialog] = useState(false)

    const buyCards = e => {
        if (!!e) {
            e.preventDefault()
        }
        if (riskOfMistakeBuyingCards(game.round.suit)) {
            showCancelDeleteCardsDialog()
        } else {
            submitBuyCards()
        }
    }

    const submitBuyCards = () => {
        GameService.buyCards(game.id, selectedCards.map(sc => sc.card)).then(response =>
            dispatch({ type: 'game/clearSelectedCards' })
        ).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
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

    const hideCancelDeleteCardsDialog = () => {
        updateDeleteCardsDialog(false)
    }

    const showCancelDeleteCardsDialog = () => {
        updateDeleteCardsDialog(true)
    }

    return (
        <div>
            {!!game.round && game.round.status === "BUYING" ?
                <CardBody className="buttonArea">

                    <Form onSubmit={buyCards}>
                        <ButtonGroup size="lg">
                            {game.myGo ? <Button type="submit" color="warning"><b>Keep Cards</b></Button> : null}
                        </ButtonGroup>
                    </Form>

                    {!!game.round.currentHand && !!game.playerProfiles && !!game.round.suit ?
                        <Modal fade={true} size="lg" toggle={hideCancelDeleteCardsDialog} isOpen={deleteCardsDialog}>

                            <ModalHeader><CardImg alt="Suit" src={`/cards/originals/${game.round.suit}_ICON.svg`} className="thumbnail_size_extra_small left-padding" /> Are you sure you want to throw these cards away?</ModalHeader>
                            <ModalBody className="called-modal">
                                <CardGroup className="gameModalCardGroup">
                                    <Card className="p-6 tableCloth" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                                        <CardBody className="cardArea">

                                            {removeAllFromArray(selectedCards.map(sc => sc.card), game.cards).map(card =>
                                                <img key={"deleteCardModal_" + card} alt={card} src={"/cards/thumbnails/" + card + ".png"} className="thumbnail_size" />
                                            )}

                                        </CardBody>



                                        <CardBody className="buttonArea">

                                            <ButtonGroup size="lg">
                                                <Button type="button" color="primary" onClick={hideCancelDeleteCardsDialog}>Cancel</Button>
                                                <Button type="button" color="warning" onClick={submitBuyCards}>Throw Cards</Button>
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

export default Buying