import { CARDS, BLANK_CARD, Card, SelectableCard } from "../model/Cards"
import { Suit } from "../model/Suit"

export const compareCards = (
    hand1: Card[] | undefined,
    hand2: Card[] | undefined,
) => {
    if (!Array.isArray(hand1) || !Array.isArray(hand2)) {
        return false
    }

    const arr1 = [...hand1].filter(ca => ca.name !== BLANK_CARD.name).sort()
    const arr2 = [...hand2].filter(ca => ca.name !== BLANK_CARD.name).sort()

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
        paddedCards.push({ ...BLANK_CARD, selected: false })
    }

    return paddedCards
}

export const processOrderedCardsAfterGameUpdate = (
    currentCards: SelectableCard[],
    updatedCardNames: string[],
): SelectableCard[] => {
    // Remove blanks
    const currentCardsNoBlanks = currentCards.filter(
        c => c.name !== BLANK_CARD.name,
    )

    // Find the delta between the existing cards and the updated cards we got from the api
    const delta = currentCardsNoBlanks.filter(
        x => !updatedCardNames.includes(x.name),
    )

    // 1. If cards in payload match ordered cards then don't change orderedCards
    if (
        delta.length === 0 &&
        currentCardsNoBlanks.length === updatedCardNames.length
    ) {
        console.log("1. returning cards as they are")
        return currentCards
    }
    // 2. If a card was removed then replace it with a Blank card in orderedCards
    else if (
        currentCardsNoBlanks.length === updatedCardNames.length + 1 &&
        delta.length === 1
    ) {
        console.log("2. a card was removed, so replacing it with a blank")
        const updatedCurrentCards = [...currentCards]
        const idx = updatedCurrentCards.findIndex(c => c.name === delta[0].name)
        updatedCurrentCards[idx] = { ...BLANK_CARD, selected: false }

        return padMyHand(updatedCurrentCards)

        // 3. Else send back a fresh hand constructed from the API data
    } else {
        console.log(`3. refreshing cards entirely currentCards`)

        const updatedCards = updatedCardNames.map<SelectableCard>(name => {
            const card = CARDS.find(c => c.name === name)!
            return { ...card, selected: false }
        })

        return padMyHand(updatedCards)
    }
}

export const riskOfMistakeBuyingCards = (
    suit: Suit,
    selectedCards: Card[],
    myCards: Card[],
) => {
    const deletingCards = removeAllFromHand(selectedCards, myCards)

    for (const element of deletingCards) {
        if (
            element.name === "JOKER" ||
            element.name === "ACE_HEARTS" ||
            element.suit === suit
        ) {
            return true
        }
    }

    return false
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

export const removeCard = (cardToRemove: Card, orginalHand: Card[]) => {
    const newHand = [...orginalHand] // make a separate copy of the array
    const index = newHand.indexOf(cardToRemove)
    if (index !== -1) {
        newHand.splice(index, 1)
    }

    return newHand
}
