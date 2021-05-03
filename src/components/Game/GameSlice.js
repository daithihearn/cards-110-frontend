const initialState = {
    game: {},
    players: [],
    orderedCards: []
}

const BLANK = "blank_card"

const compareHands = (hand1, hand2) => {
    if (
        !Array.isArray(hand1)
        || !Array.isArray(hand2)
    ) {
        return false
    }

    const arr1 = [...hand1].filter(ca => ca !== BLANK).sort()
    const arr2 = [...hand2].filter(ca => ca !== BLANK).sort()

    if (arr1.length !== arr2.length) {
        return false
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}

const setMyCards = (cards) => {
    let myCards = [...cards]

    for (let i = 0; i < 5 - cards.length; i++) {
        myCards.push({ card: BLANK, selected: false, autoplay: false })
    }

    return myCards
}

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case 'game/updateGame': {

            // If there was a card removed then remove it from both arrays. Need to detect when this happens

            let orderedCards = []
            const delta = !!state.game.cards ? state.game.cards.filter(x => !action.payload.cards.includes(x)) : []

            // 1. If cards in payload match ordered cards then don't change orderedCards
            if (compareHands(state.game.cards, action.payload.cards)) {
                orderedCards = state.orderedCards
            }
            // 2. If a card was removed then replace it with a Blank card in orderedCards
            else if (!!state.game.cards && state.game.cards.length === action.payload.cards.length + 1 && delta.length === 1) {
                const tempArr = [...state.orderedCards]
                const idx = tempArr.findIndex(c => c.card === delta[0])
                tempArr[idx].card = BLANK
                tempArr[idx].selected = false
                tempArr[idx].autoplay = false
                orderedCards = tempArr
            } else {
                action.payload.cards.forEach(c => orderedCards.push({ card: c, autoplay: false, selected: false }))
            }

            return {
                game: action.payload,
                players: state.players,
                orderedCards: setMyCards(orderedCards)
            }
        }
        case 'game/updatePlayers': {
            return {
                game: state.game,
                players: action.payload,
                orderedCards: state.orderedCards
            }
        }
        case 'game/updateOrderedCards': {
            return {
                game: state.game,
                players: state.players,
                orderedCards: setMyCards(action.payload)
            }
        }
        case 'game/clearSelectedCards': {

            const newOrderedCards = [...state.orderedCards]
            newOrderedCards.forEach(c => { c.selected = false; c.autoplay = false })

            return {
                game: state.game,
                players: state.players,
                orderedCards: newOrderedCards
            }
        }
        case 'game/exit': {
            return initialState
        }
        default:
            return state
    }
}