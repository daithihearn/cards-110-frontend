import { CARDS, EMPTY, Card, SelectableCard, CardName } from "model/Cards"
import { Round } from "model/Round"
import { Suit } from "model/Suit"

export const compareCards = (
    hand1: Card[] | undefined,
    hand2: Card[] | undefined,
) => {
    if (!Array.isArray(hand1) || !Array.isArray(hand2)) {
        return false
    }

    const arr1 = [...hand1].filter(ca => ca.name !== CardName.EMPTY).sort()
    const arr2 = [...hand2].filter(ca => ca.name !== CardName.EMPTY).sort()

    if (arr1.length !== arr2.length) {
        return false
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].name !== arr2[i].name) {
            return false
        }
    }

    return true
}

export const padMyHand = (cards: SelectableCard[]): SelectableCard[] => {
    const paddedCards = [...cards]

    for (let i = 0; i < 5 - cards.length; i++) {
        paddedCards.push({ ...EMPTY, selected: false })
    }

    return paddedCards
}

export const processOrderedCardsAfterGameUpdate = <T extends Card>(
    currentCards: SelectableCard[],
    updatedCardNames: CardName[],
): SelectableCard[] => {
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
        updatedCurrentCards[idx] = { ...EMPTY, selected: false }

        return padMyHand(updatedCurrentCards)

        // 3. Else send back a fresh hand constructed from the API data
    } else {
        const updatedCards = updatedCardNames.map<SelectableCard>(name => {
            return { ...CARDS[name], selected: false }
        })

        return padMyHand(updatedCards)
    }
}

export const riskOfMistakeBuyingCards = <T extends Card>(
    suit: Suit,
    selectedCards: T[],
    myCards: T[],
) => {
    // If you have selected 5 trumps then return false
    if (areAllTrumpCards(selectedCards, suit)) {
        return false
    }

    const deletingCards = removeAllFromHand(selectedCards, myCards)

    return containsATrumpCard(deletingCards, suit)
}

export const areAllTrumpCards = <T extends Card>(cards: T[], suit: Suit) => {
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

export const containsATrumpCard = <T extends Card>(cards: T[], suit: Suit) => {
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

export const removeAllFromHand = <T extends Card>(
    cardsToRemove: T[],
    originalHand: T[],
) => {
    let newHand = [...originalHand]
    const ctr = [...cardsToRemove]
    ctr.forEach(element => {
        newHand = removeCard(element, newHand)
    })
    return newHand
}

export const removeCard = <T extends Card>(
    cardToRemove: T,
    orginalHand: T[],
) => {
    const newHand = [...orginalHand] // make a separate copy of the array
    const index = newHand.indexOf(cardToRemove)
    if (index !== -1) {
        newHand.splice(index, 1)
    }

    return newHand
}

export const bestCardLead = (round: Round) => {
    let trumpCards = Object.values(CARDS).filter(
        c => c.suit === round.suit || c.suit === Suit.WILD,
    )

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

export const pickBestCards = <T extends Card>(
    cards: T[],
    suit: Suit,
    numPlayers: number,
): T[] => {
    // If number of players not in range 2-5 then throw an error
    if (numPlayers < 2 || numPlayers > 5) {
        throw new Error("Number of players must be between 2 and 5")
    }
    const minCardsRequired = Math.max(0, numPlayers - 3)
    const bestCards = getTrumpCards(cards, suit)

    while (bestCards.length < minCardsRequired) {
        // Find the card with the highest cold value that isn't already in the best cards
        const remainingCards = cards.filter(
            c => !bestCards.some(bc => bc.name === c.name),
        )
        if (remainingCards.length === 0) break
        bestCards.push(
            remainingCards.toSorted((a, b) => b.coldValue - a.coldValue)[0],
        )
    }

    return bestCards
}

export const getTrumpCards = <T extends Card>(cards: T[], suit: Suit): T[] =>
    cards.filter(
        card =>
            card.suit === suit ||
            card.name === CardName.JOKER ||
            card.name === CardName.ACE_HEARTS,
    )
