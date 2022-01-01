import { useState } from 'react'
import GameService from '../../services/GameService'
import parseError from '../../utils/ErrorUtils'

import { useDispatch } from 'react-redux'
import sha1 from 'crypto-js/sha1'
import { triggerBounceMessage } from '../../constants'

const AutoActionManager = (props) => {

    const game = props.game
    const orderedCards = props.orderedCards
    if (!game || !game.status || !orderedCards) {
        return null
    }

    const autoPlayCards = orderedCards.filter(card => card.autoplay && card.selected)

    const dispatch = useDispatch()

    const [previousGameHash, updatePreviousGameHash] = useState("")

    const deal = () => {
        GameService.deal(game.id).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })

        })
    }
    const playCard = (card) => {
        GameService.playCard(game.id, card).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const buyCards = (cards) => {
        GameService.buyCards(game.id, cards).then(response => {
            dispatch({ type: 'game/clearSelectedCards' })
        }).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const processActions = () => {

        // Deal when it's your turn
        if (game.iamDealer && game.round.status === "CALLING" && game.cards.length === 0) {
            setTimeout(() => deal(), 3000)
        }
        // Play card when you've pre-selected a card or you only have one left
        else if (game.round.status === "PLAYING" && game.isMyGo) {
            if (game.cards.length === 1) {
                playCard(game.cards[0])
            }
            else if (autoPlayCards.length > 0) {
                playCard(autoPlayCards[0].card)
            }
        }
        // Buy cards in if you are the goer
        else if (game.isMyGo && game.iamGoer && game.round.status === "BUYING") {
            buyCards(game.cards)
        }
    }

    // If the game hasn't changed don't do anything
    const currentGameHash = sha1(JSON.stringify(game) + JSON.stringify(autoPlayCards)).toString()

    if (currentGameHash !== previousGameHash && game.status !== "FINISHED") {
        updatePreviousGameHash(currentGameHash)
        processActions()
    }

    return null
}

export default AutoActionManager
