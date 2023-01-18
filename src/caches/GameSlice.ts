import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"

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
export const getGamePlayers = createSelector(getGame, game => game.players)
export const getMe = createSelector(getGame, game => game.me)

export const getRound = createSelector(getGame, game => game.round)
export const getCards = createSelector(getGame, game => game.cards)
export const getSuit = createSelector(getRound, round => round?.suit)
export const getGameId = createSelector(getGame, game => game.id)

export const getGameStatus = createSelector(getGame, game => game.status)

export const getHasGame = createSelector(
    getGameStatus,
    status => status === GameStatus.ACTIVE || status === GameStatus.NONE,
)
export const getIsGameActive = createSelector(
    getGameStatus,
    status => status === GameStatus.ACTIVE,
)

export const getIsGameFinished = createSelector(
    getGameStatus,
    status => status === GameStatus.FINISHED,
)

export const getRoundStatus = createSelector(getRound, round => round?.status)
export const getIsRoundCalling = createSelector(
    getRoundStatus,
    status => status === RoundStatus.CALLING,
)
export const getIsRoundCalled = createSelector(
    getRoundStatus,
    status => status === RoundStatus.CALLED,
)
export const getIsRoundBuying = createSelector(
    getRoundStatus,
    status => status === RoundStatus.BUYING,
)
export const getIsRoundPlaying = createSelector(
    getRoundStatus,
    status => status === RoundStatus.PLAYING,
)

export const getIsDoublesGame = createSelector(
    getGamePlayers,
    players => players.length === 6,
)

export const getIsMyGo = createSelector(getGame, game => game.isMyGo)
export const getIamGoer = createSelector(getGame, game => game.iamGoer)
export const getIamSpectator = createSelector(
    getGame,
    game => game.iamSpectator,
)

export const getCanBuyCards = createSelector(
    getIsMyGo,
    getIamGoer,
    getIsRoundBuying,
    (isMyGo, iamGoer, isRoundBuying) => isMyGo && iamGoer && isRoundBuying,
)

export const getIsInBunker = createSelector(
    getIsMyGo,
    getIsRoundCalling,
    getMe,
    (isMyGo, isRoundCalling, me) =>
        isMyGo && isRoundCalling && me && me?.score < -30,
)
