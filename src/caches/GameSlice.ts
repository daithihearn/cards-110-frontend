import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { GameState, GameStatus } from "../model/Game"
import { Player } from "../model/Player"
import { RoundStatus } from "../model/Round"
import { RootState } from "./caches"

const initialState: GameState = {
  iamSpectator: true,
  isMyGo: false,
  iamGoer: false,
  iamDealer: false,
  cards: [],
  status: GameStatus.NONE,
  players: [],
  playedCards: [],
}

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    updateGame: (_, action: PayloadAction<GameState>) => action.payload,
    updatePlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload
    },
    resetGame: () => initialState,
  },
})

export const { updateGame, updatePlayers, resetGame } = gameSlice.actions

export const getGame = (state: RootState) => state.game
export const getGamePlayers = (state: RootState) => state.game.players
export const getRound = (state: RootState) => state.game.round
export const getCards = (state: RootState) => state.game.cards
export const getSuit = (state: RootState) => state.game.round?.suit
export const getGameId = (state: RootState) => state.game.id
export const getHasGame = (state: RootState) =>
  state.game.status === GameStatus.ACTIVE ||
  state.game.status === GameStatus.NONE
export const getGameStatus = (state: RootState) => state.game.status
export const isGameActive = (state: RootState) =>
  state.game.status === GameStatus.ACTIVE
export const getIsRoundCalling = (state: RootState) =>
  state.game.round?.status === RoundStatus.CALLING
export const getIsRoundCalled = (state: RootState) =>
  state.game.round?.status === RoundStatus.CALLED
export const getIsRoundBuying = (state: RootState) =>
  state.game.round?.status === RoundStatus.BUYING
export const getIsRoundPlaying = (state: RootState) =>
  state.game.round?.status === RoundStatus.PLAYING
export const isDoublesGame = (state: RootState) =>
  state.game.players.length === 6
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
export const getIamGoer = (state: RootState) => state.game.iamGoer
export const getIamSpectator = (state: RootState) => state.game.iamSpectator
