import { CARDS, BLANK_CARD, Card, SelectableCard } from "../model/Cards"
import { Suit } from "../model/Suit"

export const compareCards = (
  hand1: Card[] | undefined,
  hand2: Card[] | undefined
) => {
  if (!Array.isArray(hand1) || !Array.isArray(hand2)) {
    return false
  }

  const arr1 = [...hand1].filter((ca) => ca !== BLANK_CARD).sort()
  const arr2 = [...hand2].filter((ca) => ca !== BLANK_CARD).sort()

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

export const padMyHand = (cards: SelectableCard[]): SelectableCard[] => {
  const paddedCards = [...cards]

  for (let i = 0; i < 5 - cards.length; i++) {
    paddedCards.push({ ...BLANK_CARD, selected: false })
  }

  return paddedCards
}

export const processOrderedCardsAfterGameUpdate = (
  currentCards: SelectableCard[],
  updatedCardNames: string[]
): SelectableCard[] => {
  // Find the delta between the existing cards and the updated cards we got from the api
  const delta = currentCards.filter((x) => !updatedCardNames.includes(x.name))

  const updatedCards = updatedCardNames.map<Card>(
    (name) => CARDS.find((c) => c.name === name)!
  )

  // 1. If cards in payload match ordered cards then don't change orderedCards
  if (compareCards(currentCards, updatedCards)) return currentCards
  // 2. If a card was removed then replace it with a Blank card in orderedCards
  else if (
    currentCards.length === updatedCards.length + 1 &&
    delta.length === 1
  ) {
    const updatedCurrentCards = [...currentCards]
    const idx = updatedCurrentCards.findIndex((c) => c.name === delta[0].name)
    updatedCurrentCards[idx] = { ...BLANK_CARD, selected: false }

    return padMyHand(updatedCurrentCards)

    // 3. Else send back a fresh hand constructed from the API data
  } else {
    const updatedCurrentCards: SelectableCard[] = []
    updatedCards.forEach((c) =>
      updatedCurrentCards.push({ ...c, selected: false })
    )
    return padMyHand(updatedCurrentCards)
  }
}

export const riskOfMistakeBuyingCards = (
  suit: Suit,
  selectedCards: Card[],
  myCards: Card[]
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
  originalHand: Card[]
) => {
  let newHand = [...originalHand]
  const ctr = [...cardsToRemove]
  ctr.forEach((element) => {
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
