import { useEffect } from "react"
import GameService from "../../services/GameService"

import cards, { BLANK_CARD, Card, PlayableCard } from "../../model/Cards"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
  getAutoPlayCards,
  getCanBuyCards,
  getCanDeal,
  getGameId,
  getIsInBunker,
  getIsMyGo,
  getIsRoundPlaying,
  getMyCards,
  getRound,
  getSuit,
} from "../../caches/GameSlice"
import { Round } from "../../model/Round"
import { Suit } from "../../model/Suit"
import { useSnackbar } from "notistack"

const bestCardLead = (round: Round) => {
  let trumpCards = cards.filter(
    (card) => card.suit === round.suit || card.suit === Suit.WILD
  )

  // Remove played trump cards
  round.completedHands.forEach((hand) => {
    hand.playedCards.forEach((p) => {
      const card = cards.find((c) => (c.name = p.card))
      if (
        (card && card.suit === round.suit) ||
        p.card === "JOKER" ||
        p.card === "ACE_HEARTS"
      )
        trumpCards = trumpCards.filter((c) => p.card !== c.name)
    })
  })

  // Sort Descending
  trumpCards.sort((a, b) => b.value - a.value)

  return round.currentHand.leadOut?.name === trumpCards[0].name
}

const getWorstCard = (myCards: PlayableCard[], suit: Suit) => {
  console.info(`AutoAction -> followWorst ${JSON.stringify(myCards)} ${suit}`)
  const myCardsRich = cards.filter((card) =>
    myCards.some((c) => c.name === card.name)
  )
  const myTrumpCards = myCardsRich.filter(
    (card) => card.suit === suit || card.suit === Suit.WILD
  )

  if (myTrumpCards.length > 0) {
    // Sort ascending by value
    myTrumpCards.sort((a, b) => a.value - b.value)
    return myTrumpCards[0]
  } else {
    // Sort ascending by cold value
    myCardsRich.sort((a, b) => a.coldValue - b.coldValue)

    // if we can't find a cold card that is clearly the worst card then do nothing
    if (
      myCardsRich.length > 1 &&
      myCardsRich[0].coldValue === myCardsRich[1].coldValue
    ) {
      return
    }

    return myCardsRich[0]
  }
}

const AutoActionManager = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const gameId = useAppSelector(getGameId)
  const myCards = useAppSelector(getMyCards)
  const round = useAppSelector(getRound)
  const suit = useAppSelector(getSuit)

  const autoPlayCards = useAppSelector(getAutoPlayCards)
  const canDeal = useAppSelector(getCanDeal)
  const canBuyCards = useAppSelector(getCanBuyCards)
  const isMyGo = useAppSelector(getIsMyGo)
  const isInBunker = useAppSelector(getIsInBunker)
  const isRoundPlaying = useAppSelector(getIsRoundPlaying)

  const deal = (id: string) => {
    console.info(`AutoAction -> deal `)
    dispatch(GameService.deal(id)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  const playCard = (id: string, card: Card) => {
    console.info(`AutoAction -> playCard ${JSON.stringify(card)}`)
    dispatch(GameService.playCard(id, card)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  const call = (id: string, callAmount: number) => {
    console.info(`AutoAction -> call ${callAmount}`)
    dispatch(GameService.call(id, callAmount)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  const buyCards = (gameId: string, cardsToBuy: Card[]) => {
    console.info(`AutoAction -> buyCards ${JSON.stringify(cardsToBuy)}`)
    dispatch(
      GameService.buyCards(
        gameId,
        cardsToBuy.filter((c) => c.name !== BLANK_CARD.name)
      )
    ).catch((e: Error) => enqueueSnackbar(e.message, { variant: "error" }))
  }

  // Deal when it's your turn
  useEffect(() => {
    console.debug(`Rule -> Deal`)
    if (gameId && canDeal) deal(gameId)
  }, [gameId, canDeal])

  // If in the bunker, Pass
  useEffect(() => {
    console.debug(`Rule -> Bunker`)
    if (gameId && isInBunker) call(gameId, 0)
  }, [gameId, isInBunker])

  // 1. Play card when you've pre-selected a card
  // 2. Play card when you only have one left
  // 3. Play worst card if best card lead out
  useEffect(() => {
    console.debug(`Rule -> play card`)
    if (gameId && isMyGo) {
      if (autoPlayCards.length > 0) playCard(gameId, autoPlayCards[0])
      else if (isRoundPlaying && myCards.length === 1)
        playCard(gameId, myCards[0])
      else if (suit && round && round.suit && bestCardLead(round)) {
        const cardToPlay = getWorstCard(myCards, suit)
        if (cardToPlay) playCard(gameId, cardToPlay)
      }
    }
  }, [suit, gameId, round, isMyGo, myCards, isRoundPlaying, autoPlayCards])

  // Buy cards in if you are the goer
  useEffect(() => {
    console.debug(`Rule -> buy cards`)
    if (gameId && canBuyCards) buyCards(gameId, myCards)
  }, [gameId, myCards, canBuyCards])

  return null
}

export default AutoActionManager
