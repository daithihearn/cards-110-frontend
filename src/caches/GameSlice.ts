import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { PlayableCard } from "../model/Cards"
import { GameState, GameStateResponse, GameStatus } from "../model/Game"
import { Player } from "../model/Player"
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
    exit: () => {
      return initialState
    },
  },
})

export const {
  updateGame,
  updatePlayers,
  updateCards,
  clearSelectedCards,
  exit,
} = gameSlice.actions

export const getGame = (state: RootState) => state.game
export const getGameId = (state: RootState) => state.game.id
export const isGameActive = (state: RootState) =>
  state.game.status === GameStatus.ACTIVE ||
  state.game.status === GameStatus.NONE
export const isDoublesGame = (state: RootState) =>
  state.game.players.length === 6
