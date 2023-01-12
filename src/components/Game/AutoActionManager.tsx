import { useEffect, useState } from "react"
import GameService from "../../services/GameService"

import cards, { BLANK_CARD, Card, PlayableCard } from "../../model/Cards"

import sha1 from "crypto-js/sha1"
import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getGame } from "../../caches/GameSlice"
import { getMyProfile } from "../../caches/MyProfileSlice"
import { Round, RoundStatus } from "../../model/Round"
import { Suit } from "../../model/Suit"
import { GameStatus } from "../../model/Game"
import { useSnackbar } from "notistack"

const bestCardLead = (round: Round) => {
  let trumpCards = cards.filter(
    (card) => card.suit === round.suit || card.suit === Suit.WILD
  )

  // Remove played trump cards
  round.completedHands.forEach((hand) => {
    if (hand.playedCards.forEach) {
      hand.playedCards.forEach((card) => {
        if (
          card.suit === round.suit ||
          card.name === "JOKER" ||
          card.name === "ACE_HEARTS"
        )
          trumpCards = trumpCards.filter((c) => card.name !== c.name)
      })
    }
  })

  // Sort Descending
  trumpCards.sort((a, b) => b.value - a.value)

  return round.currentHand.leadOut?.name === trumpCards[0].name
}

const AutoActionManager = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const game = useAppSelector(getGame)
  const myProfile = useAppSelector(getMyProfile)

  const [previousGameHash, updatePreviousGameHash] = useState("")

  useEffect(() => {
    // If the game hasn't changed don't do anything
    const currentGameHash = sha1(
      JSON.stringify(game) + JSON.stringify(autoPlayCards)
    ).toString()

    if (
      currentGameHash !== previousGameHash &&
      game.status !== GameStatus.FINISHED
    ) {
      processActions()
      updatePreviousGameHash(currentGameHash)
    }
  }, [game, previousGameHash, myProfile])

  const autoPlayCards = game.cards.filter(
    (card) => card.autoplay && card.selected
  )

  const deal = (gameId: string) =>
    dispatch(GameService.deal(gameId)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )

  const playCard = (gameId: string, card: Card) =>
    dispatch(GameService.playCard(gameId, card)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )

  const call = (gameId: string, callAmount: number) =>
    dispatch(GameService.call(gameId, callAmount)).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )

  const buyCards = (gameId: string, cardsToBuy: Card[]) =>
    dispatch(
      GameService.buyCards(
        gameId,
        cardsToBuy.filter((c) => c.name !== BLANK_CARD.name)
      )
    ).catch((e: Error) => enqueueSnackbar(e.message, { variant: "error" }))

  const followWorstCard = (
    gameId: string,
    myCards: PlayableCard[],
    suit: Suit
  ) => {
    const myCardsRich = cards.filter((card) =>
      myCards.some((c) => c.name === card.name)
    )
    const myTrumpCards = myCardsRich.filter(
      (card) => card.suit === suit || card.suit === Suit.WILD
    )

    if (myTrumpCards.length > 0) {
      // Sort ascending by value
      myTrumpCards.sort((a, b) => a.value - b.value)
      playCard(gameId, myTrumpCards[0])
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

      playCard(gameId, myCardsRich[0])
    }
  }

  const processActions = () => {
    if (!game.id || !game.round || !game.me) return
    // Deal when it's your turn
    else if (
      game.iamDealer &&
      game.round.status === RoundStatus.CALLING &&
      game.cards.length === 0
    )
      deal(game.id)
    // If in the bunker, Pass
    else if (
      game.round.status === RoundStatus.CALLING &&
      game.isMyGo &&
      game.me.score < -30
    )
      call(game.id, 0)
    // Play card when you've pre-selected a card
    else if (
      game.round.status === RoundStatus.PLAYING &&
      game.isMyGo &&
      autoPlayCards.length > 0
    )
      playCard(game.id, autoPlayCards[0])
    // Play card when you only have one left
    else if (
      game.round.status === RoundStatus.PLAYING &&
      game.isMyGo &&
      game.cards.length === 1
    )
      playCard(game.id, game.cards[0])
    // Buy cards in if you are the goer
    else if (
      game.isMyGo &&
      game.iamGoer &&
      game.round.status === RoundStatus.BUYING
    )
      buyCards(game.id, game.cards)
    // Autoselect worst card if best card lead out
    else if (
      game.round.status === RoundStatus.PLAYING &&
      game.isMyGo &&
      bestCardLead(game.round) &&
      game.round.suit
    )
      followWorstCard(game.id, game.cards, game.round.suit)
  }

  return null
}

export default AutoActionManager
