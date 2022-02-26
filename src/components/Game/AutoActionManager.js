import { useState } from 'react'
import GameService from '../../services/GameService'
import parseError from '../../utils/ErrorUtils'
import { useAuth0 } from '@auth0/auth0-react'
import cards from '../../model/Cards'

import { useDispatch } from 'react-redux'
import sha1 from 'crypto-js/sha1'
import { triggerBounceMessage } from '../../constants'

const bestCardLead = (round) => {
    let trumpCards = cards.filter(card => card.suit === round.suit || card.suit === "WILD")

    // Remove played trump cards
    round.completedHands.forEach(hand => {
        for (let i in hand.playedCards) {
            const card = hand.playedCards[i]
            if (card.indexOf(round.suit) > -1 || card === "JOKER" || card === "ACE_HEARTS") {
                trumpCards = trumpCards.filter((c) => card !== c.name)
            }
        }
    })

    // Sort Descending
    trumpCards.sort((a, b) => b.value - a.value)

    return round.currentHand.leadOut === trumpCards[0].name

}

const AutoActionManager = (props) => {

    const dispatch = useDispatch()

    const { getAccessTokenSilently } = useAuth0()

    const [previousGameHash, updatePreviousGameHash] = useState("")

    const game = props.game
    const orderedCards = props.orderedCards
    if (!game || !game.status || !orderedCards) {
        return null
    }

    const autoPlayCards = orderedCards.filter(card => card.autoplay && card.selected)

    const deal = () => {
        getAccessTokenSilently().then(accessToken => {
            GameService.deal(game.id, accessToken).catch(error => {
                if (error.message === triggerBounceMessage) { return }
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }
    const playCard = (card) => {
        getAccessTokenSilently().then(accessToken => {
            GameService.playCard(game.id, card, accessToken).catch(error => {
                if (error.message === triggerBounceMessage) { return }
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const call = (callAmount) => {
        getAccessTokenSilently().then(accessToken => {
            GameService.call(game.id, callAmount, accessToken).catch(error => {
                if (error.message === triggerBounceMessage) { return }
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const buyCards = (cardsToBuy) => {
        getAccessTokenSilently().then(accessToken => {
            GameService.buyCards(game.id, cardsToBuy, accessToken).then(response => {
                dispatch({ type: 'game/clearSelectedCards' })
            }).catch(error => {
                if (error.message === triggerBounceMessage) { return }
                dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
            })
        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }

    const chooseWorstCardToFollow = (myCards, suit) => {
        const myCardsRich = cards.filter(card => myCards.indexOf(card.name) > -1)
        const myTrumpCards = myCardsRich.filter(card => card.suit === suit || card.suit === "WILD")

        if (myTrumpCards.length > 0) {
            // Sort Ascending
            myTrumpCards.sort((a, b) => a.value - b.value)
            playCard(myTrumpCards[0].name)
        } else {
            // Sort Descending
            myCardsRich.sort((a, b) => a.coldValue - b.coldValue)
            playCard(myCardsRich[0].name)
        }

    }

    const processActions = () => {

        // Deal when it's your turn
        if (game.iamDealer && game.round.status === "CALLING" && game.cards.length === 0) {
            setTimeout(() => deal(), 3000)
        }
        // If in the bunker, Pass
        else if (game.round.status === "CALLING" && game.me.score < -30) {
            call(0)
        }
        // Play card when you've pre-selected a card
        else if (game.round.status === "PLAYING" && game.isMyGo && autoPlayCards.length > 0) {
            playCard(autoPlayCards[0].card)
        }
        // Play card when you only have one left
        else if (game.round.status === "PLAYING" && game.isMyGo && game.cards.length === 1) {
            playCard(game.cards[0])
        }
        // Buy cards in if you are the goer
        else if (game.isMyGo && game.iamGoer && game.round.status === "BUYING") {
            buyCards(game.cards)
        }
        // Autoselect worst card if best card lead out
        else if (game.round.status === "PLAYING" && game.isMyGo && bestCardLead(game.round)) {
            chooseWorstCardToFollow(game.cards, game.round.suit)
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
