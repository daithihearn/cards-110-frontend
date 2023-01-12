import cards, { BLANK_CARD, Card, PlayableCard } from "../model/Cards"
import { Hand } from "../model/Hand"

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

export const padMyHand = (cards: PlayableCard[]): PlayableCard[] => {
  const paddedCards = [...cards]

  for (let i = 0; i < 5 - cards.length; i++) {
    paddedCards.push({ ...BLANK_CARD, selected: false, autoplay: false })
  }

  return paddedCards
}

export const processOrderedCardsAfterGameUpdate = (
  currentCards: PlayableCard[],
  updatedCardNames: string[]
): PlayableCard[] => {
  // If there was a card removed then remove it from both arrays. Need to detect when this happens

  const delta = !!currentCards
    ? currentCards.filter((x) => !updatedCardNames.includes(x.name))
    : []

  const updatedCards = updatedCardNames.map<Card>(
    (name) => cards.find((c) => c.name === name)!
  )

  // 1. If cards in payload match ordered cards then don't change orderedCards
  if (compareCards(currentCards, updatedCards)) return currentCards
  // 2. If a card was removed then replace it with a Blank card in orderedCards
  else if (
    !!currentCards &&
    currentCards.length === updatedCards.length + 1 &&
    delta.length === 1
  ) {
    const tempArr = [...currentCards]
    const idx = tempArr.findIndex((c) => c.name === delta[0].name)
    tempArr[idx] = { ...BLANK_CARD, selected: false, autoplay: false }

    return padMyHand(tempArr)
  } else {
    const updatedOrderedCards: PlayableCard[] = []
    updatedCards.forEach((c) =>
      updatedOrderedCards.push({ ...c, autoplay: false, selected: false })
    )
    return padMyHand(updatedOrderedCards)
  }
}
