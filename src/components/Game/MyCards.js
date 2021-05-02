import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, ButtonGroup, CardImg, CardBody } from 'reactstrap'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import parseError from '../../utils/ErrorUtils'

import gameService from '../../services/GameService'

const MyCards = () => {
    const dispatch = useDispatch()

    const game = useSelector(state => state.game.game)

    if (!game || !game.orderedCards) {
        return null
    }

    const selectedCards = game.orderedCards.filter(card => card.selected)

    const [doubleClickTracker, updateDoubleClickTracker] = useState({})

    const BLANK = "blank_card"
    const cardsSelectable = ["CALLED", "BUYING", "PLAYING"].includes(game.round.status)

    const handleSelectCard = (card) => e => {
        if (!cardsSelectable || card === BLANK) {
            return
        }

        let updatedCards = [...game.orderedCards]

        // If the round status is PLAYING then only allow one card to be selected
        if (game.round.status === "PLAYING") {
            if (!!doubleClickTracker && doubleClickTracker.card === card && (Date.now() - doubleClickTracker.time < 500)) {
                updatedCards.forEach(c => { if (c.card === card.card) { c.selected = true; c.autoplay = true } })
            } else if (!card.selected) {
                updatedCards.forEach(c => { if (c.card === card.card) { c.selected = true; c.autoplay = false } else { c.selected = false; c.autoplay = false } })
                updateDoubleClickTracker({ time: Date.now(), card: card })

            } else {
                updateDoubleClickTracker({ time: Date.now(), card: card })
                dispatch({ type: 'game/clearSelectedCards' })
                return
            }
        }
        else {
            updatedCards.forEach(c => { if (c.card === card.card) { c.selected = !c.selected } })
        }

        dispatch({ type: 'game/updateOrderedCards', payload: updatedCards })
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const newCards = Array.from(game.orderedCards)
        const [reorderedItem] = newCards.splice(result.source.index, 1)
        newCards.splice(result.destination.index, 0, reorderedItem)

        dispatch({ type: 'game/updateOrderedCards', payload: newCards })
    }

    const getStyleForCard = (card) => {
        let classes = "thumbnail_size ";

        if (cardsSelectable && card.card !== BLANK) {
            if (card.autoplay) {
                classes += "cardAutoPlayed";
            } else if (!card.selected) {
                classes += "cardNotSelected";
            }
        }

        return classes;
    }

    const playCard = () => {

        if (selectedCards.length !== 1) {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError({ message: "Please select exactly one card to play" }) } })
        } else {
            dispatch({ type: 'game/disableActions' })
            gameService.playCard(game.id, selectedCards[0].card).catch(error => {
                dispatch({ type: 'game/enableActions' })
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
        }
    }

    return (
        <div>
            {!!game.me && !!game.cards ?
                <CardBody className="cardArea">

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters" direction="horizontal">
                            {(provided) => (
                                <div className="characters" style={{ display: "inline-flex" }} {...provided.droppableProps} ref={provided.innerRef}>
                                    {game.orderedCards.map((card, index) => {
                                        return (

                                            <Draggable key={card.card + index} draggableId={card.card + index} index={index} isDragDisabled={card.card === BLANK}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <CardImg alt={card.card} onClick={handleSelectCard(card)}
                                                            src={"/cards/thumbnails/" + card.card + ".png"}
                                                            className={getStyleForCard(card)} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </CardBody>
                : null}

            {!!game && !!game.round && game.round.status === "PLAYING" ?
                <CardBody className="buttonArea">

                    <ButtonGroup size="lg">
                        {game.myGo ? <Button id="playCardButton" type="button" disabled={game.actionsDisabled} onClick={playCard} color="warning"><b>Play Card</b></Button> : null}
                    </ButtonGroup>

                </CardBody>
                : null}
        </div>
    )
}

export default MyCards