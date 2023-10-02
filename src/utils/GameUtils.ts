import { CARDS, EMPTY, Card, CardName } from "model/Cards"
import { Round } from "model/Round"
import { Suit } from "model/Suit"

export const removeEmptyCards = (cards: Card[]): Card[] =>
    [...cards].filter(c => c.name !== CardName.EMPTY)

export const compareCards = (
    hand1: Card[] | undefined,
    hand2: Card[] | undefined,
) => {
    if (!Array.isArray(hand1) || !Array.isArray(hand2)) {
        return false
    }

    let h1 = removeEmptyCards(hand1)
    let h2 = removeEmptyCards(hand2)

    if (h1.length !== h2.length) {
        return false
    }

    h1 = h1.sort((a, b) => a.name.localeCompare(b.name))
    h2 = h2.sort((a, b) => a.name.localeCompare(b.name))

    for (let i = 0; i < h1.length; i++) {
        if (h1[i].name !== h2[i].name) {
            return false
        }
    }

    return true
}

export const padMyHand = (cards: Card[]): Card[] => {
    const paddedCards = [...cards]

    for (let i = 0; i < 5 - cards.length; i++) {
        paddedCards.push({ ...EMPTY, selected: false })
    }

    return paddedCards
}

export const processOrderedCardsAfterGameUpdate = (
    currentCards: Card[],
    updatedCardNames: CardName[],
): Card[] => {
    // Remove blanks
    const currentCardsNoBlanks = currentCards.filter(
        c => c.name !== CardName.EMPTY,
    )

    // Find the delta between the existing cards and the updated cards we got from the api
    const delta = currentCardsNoBlanks.filter(
        x => !updatedCardNames.includes(x.name),
    )

    // 1. If cards in payload match ordered cards then don't change orderedCards
    if (
        delta.length === 0 &&
        currentCardsNoBlanks.length === updatedCardNames.length
    )
        return currentCards
    // 2. If a card was removed then replace it with a Blank card in orderedCards
    else if (
        currentCardsNoBlanks.length === updatedCardNames.length + 1 &&
        delta.length === 1
    ) {
        const updatedCurrentCards = [...currentCards]
        const idx = updatedCurrentCards.findIndex(c => c.name === delta[0].name)
        updatedCurrentCards[idx] = { ...EMPTY }

        return padMyHand(updatedCurrentCards)
    }
    // 3. Else send back a fresh hand constructed from the API data
    else {
        const updatedCards = updatedCardNames.map<Card>(name => {
            return { ...CARDS[name], selected: false }
        })

        return padMyHand(updatedCards)
    }
}

export const areAllTrumpCards = (cards: Card[], suit: Suit) => {
    for (const element of cards) {
        if (
            element.name !== CardName.JOKER &&
            element.name !== CardName.ACE_HEARTS &&
            element.suit !== suit
        ) {
            return false
        }
    }

    return true
}

export const containsATrumpCard = (cards: Card[], suit: Suit) => {
    for (const element of cards) {
        if (
            element.name === CardName.JOKER ||
            element.name === CardName.ACE_HEARTS ||
            element.suit === suit
        ) {
            return true
        }
    }

    return false
}

export const removeCard = (cardToRemove: Card, orginalHand: Card[]) => {
    const newHand = [...orginalHand] // make a separate copy of the array
    const index = newHand.findIndex(c => c.name === cardToRemove.name)
    if (index !== -1) {
        newHand.splice(index, 1)
    }

    return newHand
}

export const removeAllFromHand = (
    cardsToRemove: Card[],
    originalHand: Card[],
) => {
    let newHand = [...originalHand]
    const ctr = [...cardsToRemove]
    ctr.forEach(element => {
        newHand = removeCard(element, newHand)
    })
    return newHand
}

export const riskOfMistakeBuyingCards = (
    suit: Suit,
    selectedCards: Card[],
    myCards: Card[],
) => {
    // If you have selected 5 trumps then return false
    if (selectedCards.length === 5 && areAllTrumpCards(selectedCards, suit)) {
        return false
    }

    const deletingCards = removeAllFromHand(selectedCards, myCards)

    return containsATrumpCard(deletingCards, suit)
}

export const getTrumpCards = (cards: Card[], suit: Suit): Card[] =>
    cards.filter(
        card =>
            card.suit === suit ||
            card.name === CardName.JOKER ||
            card.name === CardName.ACE_HEARTS,
    )

export const bestCardLead = (round: Round) => {
    if (!round.suit) return false
    let trumpCards = getTrumpCards(Object.values(CARDS), round.suit)

    // Remove played trump cards
    round.completedHands.forEach(hand => {
        hand.playedCards.forEach(p => {
            const card = CARDS[p.card]
            if (
                (card && card.suit === round.suit) ||
                p.card === CardName.JOKER ||
                p.card === CardName.ACE_HEARTS
            )
                trumpCards = trumpCards.filter(c => p.card !== c.name)
        })
    })

    // Sort Descending
    trumpCards.sort((a, b) => b.value - a.value)

    return round.currentHand.leadOut === trumpCards[0].name
}

export const getWorstCard = (cards: Card[], round: Round) => {
    if (cards.length === 0) return undefined

    // Check if must follow suit
    const leadOut = round.currentHand?.leadOut
    let suitLead = leadOut ? CARDS[leadOut as CardName]?.suit : undefined

    if (suitLead === Suit.WILD) {
        suitLead = round.suit
    }

    if (suitLead) {
        const myCards = cards.filter(card => card.suit === suitLead)
        if (myCards.length > 0) {
            // Sort ascending by value
            myCards.sort((a, b) => a.value - b.value)
            return myCards[0]
        }
    }

    // Sort ascending by value
    cards.sort((a, b) => a.value - b.value)

    return cards[0]
}

export const getBestCard = (cards: Card[], round: Round) => {
    if (cards.length === 0) return undefined

    // Check for trump cards
    const myTrumpCards = cards.filter(
        card => card.suit === round.suit || card.suit === Suit.WILD,
    )

    if (myTrumpCards.length > 0) {
        // Sort descending by value
        myTrumpCards.sort((a, b) => b.value - a.value)
        return myTrumpCards[0]
    }

    // Check if have any cold cards
    const leadOut = round.currentHand?.leadOut
    const suitLead = leadOut ? CARDS[leadOut as CardName]?.suit : undefined

    if (suitLead && suitLead !== Suit.WILD && suitLead !== round.suit) {
        const myColdCards = cards.filter(card => card.suit === suitLead)
        if (myColdCards.length > 0) {
            // Sort descending by cold value
            myColdCards.sort((a, b) => b.coldValue - a.coldValue)
            return myColdCards[0]
        }
    }

    // Sort descending by cold value
    cards.sort((a, b) => b.coldValue - a.coldValue)

    return cards[0]
}

/**
 * Calculate the minimum number of cards that you must keep in your hand
 * @param numPlayers
 * @returns
 */
export const calculateMinCardsToKeep = (numPlayers: number): number => {
    switch (numPlayers) {
        case 2:
            return 0
        case 3:
            return 0
        case 4:
            return 1
        case 5:
            return 2
        case 6:
            return 2
        default:
            throw new Error("Number of players must be between 2 and 6")
    }
}

export const pickBestCards = (
    cards: Card[],
    suit: Suit,
    numPlayers: number,
): Card[] => {
    const minCardsToKeep = calculateMinCardsToKeep(numPlayers)
    const bestCards = getTrumpCards(cards, suit)

    while (bestCards.length < minCardsToKeep) {
        // Find the card with the highest cold value that isn't already in the best cards
        const remainingCards = cards
            .filter(c => !bestCards.some(bc => bc.name === c.name))
            .sort((a, b) => b.coldValue - a.coldValue)
        if (remainingCards.length === 0) break

        bestCards.push(remainingCards[0])
    }

    return bestCards
}
