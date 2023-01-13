import { useEffect } from "react"
import GameService from "../../services/GameService"

import { CARDS } from "../../model/Cards"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import {
  getCanBuyCards,
  getCanDeal,
  getCards,
  getGameId,
  getIsInBunker,
  getIsMyGo,
  getRound,
} from "../../caches/GameSlice"
import { Round, RoundStatus } from "../../model/Round"
import { Suit } from "../../model/Suit"
import { useSnackbar } from "notistack"
import { getAutoPlayCard } from "../../caches/AutoPlaySlice"

const bestCardLead = (round: Round) => {
  let trumpCards = CARDS.filter(
    (c) => c.suit === round.suit || c.suit === Suit.WILD
  )

  // Remove played trump cards
  round.completedHands.forEach((hand) => {
    hand.playedCards.forEach((p) => {
      const card = CARDS.find((c) => (c.name = p.card))
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

  return round.currentHand.leadOut === trumpCards[0].name
}

const getWorstCard = (cards: string[], suit: Suit) => {
  console.info(`AutoAction -> followWorst`)
  const myCardsRich = CARDS.filter((card) => cards.some((c) => c === card.name))
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
  const round = useAppSelector(getRound)
  const cards = useAppSelector(getCards)

  const autoPlayCard = useAppSelector(getAutoPlayCard)
  const canDeal = useAppSelector(getCanDeal)
  const canBuyCards = useAppSelector(getCanBuyCards)
  const isMyGo = useAppSelector(getIsMyGo)
  const isInBunker = useAppSelector(getIsInBunker)

  const deal = (id: string) => {
    console.info(`AutoAction -> deal `)
    dispatch(GameService.deal(id)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  const playCard = (id: string, card: string) => {
    console.info(`AutoAction -> playCard`)
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

  const buyCards = (gameId: string, cardsToBuy: string[]) => {
    console.info(`AutoAction -> buy cards`)
    dispatch(GameService.buyCards(gameId, cardsToBuy)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  // Deal when it's your turn
  useEffect(() => {
    console.info(`Rule -> Deal`)
    if (gameId && canDeal) deal(gameId)
  }, [gameId, canDeal])

  // If in the bunker, Pass
  useEffect(() => {
    console.info(`Rule -> Bunker`)
    if (gameId && isInBunker) call(gameId, 0)
  }, [gameId, isInBunker])

  // 1. Play card when you've pre-selected a card
  // 2. Play card when you only have one left
  // 3. Play worst card if best card lead out
  useEffect(() => {
    console.info(`Rule -> play card`)
    if (
      gameId &&
      isMyGo &&
      round?.suit &&
      round.status === RoundStatus.PLAYING
    ) {
      if (autoPlayCard) playCard(gameId, autoPlayCard)
      else if (cards.length === 1) playCard(gameId, cards[0])
      else if (bestCardLead(round)) {
        const cardToPlay = getWorstCard(cards, round.suit)
        if (cardToPlay) playCard(gameId, cardToPlay.name)
      }
    }
  }, [gameId, round, isMyGo, cards, autoPlayCard])

  // Buy cards in if you are the goer
  useEffect(() => {
    console.info(`Rule -> buy cards`)
    if (gameId && canBuyCards) buyCards(gameId, cards)
  }, [gameId, cards, canBuyCards])

  return null
}

export default AutoActionManager
