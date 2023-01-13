import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { PlayableCard } from "../model/Cards"
import { GameState, GameStateResponse, GameStatus } from "../model/Game"
import { Player } from "../model/Player"
import { RoundStatus } from "../model/Round"
import {
  padMyHand,
  processOrderedCardsAfterGameUpdate,
} from "../utils/GameUtils"
import { RootState } from "./caches"

const initialState: GameState = {
  iamSpectator: true,
  isMyGo: false,
  iamGoer: false,
  iamDealer: false,
  cards: [],
  status: GameStatus.NONE,
  players: [],
}

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<GameStateResponse>) => {
      return {
        ...action.payload,
        cards: action.payload.iamSpectator
          ? []
          : processOrderedCardsAfterGameUpdate(
              state.cards,
              action.payload.cards
            ),
      }
    },
    updatePlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload
    },
    updateCards: (state, action: PayloadAction<PlayableCard[]>) => {
      state.cards = padMyHand(action.payload)
    },
    clearSelectedCards: (state) => {
      state.cards.forEach((c) => {
        c.selected = false
        c.autoplay = false
      })
    },
    resetGame: () => {
      return initialState
    },
  },
})

export const {
  updateGame,
  updatePlayers,
  updateCards,
  clearSelectedCards,
  resetGame,
} = gameSlice.actions

export const getGame = (state: RootState) => state.game
export const getMyCards = (state: RootState) => state.game.cards
export const getGamePlayers = (state: RootState) => state.game.players
export const getRound = (state: RootState) => state.game.round
export const getSuit = (state: RootState) => state.game.round?.suit
export const getGameId = (state: RootState) => state.game.id
export const getHasGame = (state: RootState) => !!state.game.id
export const getGameStatus = (state: RootState) => state.game.status
export const isGameActive = (state: RootState) =>
  state.game.status === GameStatus.ACTIVE ||
  state.game.status === GameStatus.NONE
export const getIsRoundCalling = (state: RootState) =>
  state.game.round?.status === RoundStatus.CALLING
export const getIsRoundPlaying = (state: RootState) =>
  state.game.round?.status === RoundStatus.PLAYING
export const isDoublesGame = (state: RootState) =>
  state.game.players.length === 6
export const getAutoPlayCards = (state: RootState) =>
  state.game.cards.filter((card) => card.autoplay && card.selected)
export const getCanDeal = (state: RootState) =>
  state.game.iamDealer &&
  state.game.round &&
  state.game.round.status === RoundStatus.DEALING
export const getCanBuyCards = (state: RootState) =>
  state.game.isMyGo &&
  state.game.iamGoer &&
  state.game.round &&
  state.game.round.status === RoundStatus.BUYING

export const getIsInBunker = (state: RootState) =>
  state.game.isMyGo &&
  state.game.round?.status === RoundStatus.CALLING &&
  state.game.me &&
  state.game.me?.score < -30

export const getIsMyGo = (state: RootState) => state.game.isMyGo
