import { useState } from 'react'
import gameService from '../../services/GameService'
import parseError from '../../utils/ErrorUtils'

import { useDispatch, useSelector } from 'react-redux'
import sha1 from 'crypto-js/sha1'

const AutoActionManager = () => {

    const game = useSelector(state => state.game.game)
    if (!game || !game.status || !game.orderedCards) {
        return null
    }
    
    const autoPlayCards = game.orderedCards.filter(card => card.autoplay && card.selected)

    const dispatch = useDispatch()

    const [dealEventTime, updateDealEventTime] = useState(0)
    const [playCardEventTime, updatePlayCardEventTime] = useState(0)
    const [previousGameHash, updatePreviousGameHash] = useState("")

    const deal = () => {
        // Adding a check for trigger bounce
        if (Date.now() - dealEventTime > 3000) {
            updateDealEventTime(Date.now())
            setTimeout(() => processDeal(), 3000)
        }
    }

    const processDeal = () => {
        gameService.deal(game.id).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const playCard = (card) => {
        // Adding a check for trigger bounce
        if (Date.now() - playCardEventTime > 3000) {
            updatePlayCardEventTime(Date.now())
            dispatch({ type: 'game/disableActions' })
            setTimeout(() => processPlayCard(card), 200)
        }
    }

    const processPlayCard = (card) => {
        gameService.playCard(game.id, card).catch(error => {
            dispatch({ type: 'game/enableActions' })
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const buyCards = (cards) => {
        dispatch({ type: 'game/disableActions' })
        setTimeout(() => processBuyCards(cards), 500)
        dispatch({ type: 'game/clearSelectedCards' })
    }

    const processBuyCards = (cards) => {
        gameService.buyCards(game.id, cards).catch(error => {
            dispatch({ type: 'game/enableActions' })
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const processActions = () => {

        // Deal when it's your turn
        if (game.iamDealer && game.round.status === "CALLING" && game.cards.length === 0) {
            deal()
        }
        // Play card when you've pre-selected a card or you only have one left
        else if (game.round.status === "PLAYING" && game.myGo) {
            if (game.cards.length === 1) {
                playCard(game.cards[0])
            }
            else if (autoPlayCards.length > 0) {
                playCard(autoPlayCards[0].card)
            }
        }
        // Buy cards in if you are the goer
        else if (game.myGo && game.iamGoer && game.round.status === "BUYING") {
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
