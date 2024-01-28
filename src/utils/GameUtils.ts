import { CARDS, EMPTY, Card, CardName } from "model/Cards"
import { Round } from "model/Round"
import { Suit } from "model/Suit"

// Comparison functions
const compareByValueAsc = (a: Card, b: Card) => a.value - b.value
const compareByValueDesc = (a: Card, b: Card) => b.value - a.value
const compareByColdValueAsc = (a: Card, b: Card) => a.coldValue - b.coldValue
const compareByColdValueDesc = (a: Card, b: Card) => b.coldValue - a.coldValue
const compareByName = (a: Card, b: Card) => a.name.localeCompare(b.name)

export const removeEmptyCards = (cards: Card[]): Card[] =>
    [...cards].filter(c => c.name !== CardName.EMPTY)

export const compareCards = (hand1: Card[], hand2: Card[]) => {
    let h1 = removeEmptyCards(hand1)
    let h2 = removeEmptyCards(hand2)

    if (h1.length !== h2.length) {
        return false
    }

    h1 = h1.sort(compareByName)
    h2 = h2.sort(compareByName)

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
        x => !updatedCardNames?.includes(x.name),
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
    cards.filter(card => card.suit === suit || card.suit === Suit.WILD)

export const getColdCards = (cards: Card[], suit: Suit): Card[] =>
    cards.filter(card => card.suit !== suit && card.suit !== Suit.WILD)

export const bestCardLead = (round: Round) => {
    if (!round.suit) return false
    let trumpCards = getTrumpCards(Object.values(CARDS), round.suit)

    // Remove played trump cards
    round.completedHands.forEach(hand => {
        hand.playedCards?.forEach(p => {
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
    trumpCards.sort(compareByValueDesc)

    return round.currentHand.leadOut === trumpCards[0].name
}

export const canRenege = (myCard: Card, cardLead: Card, suit: Suit) => {
    // If the card lead isn't a trump card then throw an error
    if (cardLead.suit !== suit && cardLead.suit !== Suit.WILD) {
        throw new Error("Card lead must be a trump card")
    }

    // If my card isn't a trump card then throw an error
    if (myCard.suit !== suit && myCard.suit !== Suit.WILD) {
        throw new Error("My card must be a trump card")
    }

    // If my card has a value greater than 112 and greater than the card lead then you can renege
    return myCard.value >= 112 && myCard.value > cardLead.value
}

export const getWorstCard = (cards: Card[], round: Round) => {
    if (cards.length === 0) throw new Error("No cards to choose from")
    if (cards.length === 1) return cards[0]

    // Check if must follow suit
    const roundSuit = round.suit
    if (!roundSuit) throw new Error("Round suit cannot be undefined")
    const leadOut = round.currentHand?.leadOut
    let suitLead = leadOut ? CARDS[leadOut]?.suit : undefined
    if (suitLead === Suit.WILD) suitLead = roundSuit

    const myTrumpCards = getTrumpCards(cards, roundSuit).sort(compareByValueAsc)
    const myColdCards = getColdCards(cards, roundSuit).sort(
        compareByColdValueAsc,
    )

    // If no card lead play the worst card
    if (!leadOut) {
        // If we have cold cards then play the worst one
        if (myColdCards.length > 0) {
            return myColdCards[0]
        }
        // Otherwise play the worst trump card
        else if (myTrumpCards.length > 0) {
            return myTrumpCards[0]
        }
    }
    // Handle when suit lead is the trump suit
    else if (suitLead === roundSuit) {
        // Get trump cards that aren't renegable
        const notRenegableTrumpCards = myTrumpCards.filter(
            c => !canRenege(c, CARDS[leadOut], roundSuit),
        )
        if (notRenegableTrumpCards.length > 0) {
            return notRenegableTrumpCards[0]
        } else if (myColdCards.length > 0) {
            return myColdCards[0]
        } else if (myTrumpCards.length > 0) {
            return myTrumpCards[0]
        }
    }
    // Handle when suit lead is not the trump suit
    else if (suitLead) {
        const myCards = cards.filter(card => card.suit === suitLead)
        if (myCards.length > 0) {
            // Sort ascending by value
            myCards.sort(compareByValueAsc)
            return myCards[0]
        }
    }

    throw new Error("No card to play")
}

export const getBestCard = (cards: Card[], round: Round) => {
    if (cards.length === 0) throw new Error("No cards to choose from")
    if (cards.length === 1) return cards[0]

    // Check for trump cards
    const myTrumpCards = cards.filter(
        card => card.suit === round.suit || card.suit === Suit.WILD,
    )

    if (myTrumpCards.length > 0) {
        // Sort descending by value
        myTrumpCards.sort(compareByValueDesc)
        return myTrumpCards[0]
    }

    // Check if have any cold cards
    const leadOut = round.currentHand?.leadOut
    const suitLead = leadOut ? CARDS[leadOut]?.suit : undefined

    if (suitLead && suitLead !== Suit.WILD && suitLead !== round.suit) {
        const myColdCards = cards.filter(card => card.suit === suitLead)
        if (myColdCards.length > 0) {
            // Sort descending by cold value
            myColdCards.sort(compareByColdValueDesc)
            return myColdCards[0]
        }
    }

    // Sort descending by cold value
    cards.sort(compareByColdValueDesc)

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
        case 3:
        case 4:
            return 0
        case 5:
            return 1
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
            .sort(compareByColdValueDesc)
        if (remainingCards.length === 0) break

        bestCards.push(remainingCards[0])
    }

    return bestCards
}
