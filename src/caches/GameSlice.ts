import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { GameState, GameStatus, PlayedCard } from "model/Game"
import { Player } from "model/Player"
import { RoundStatus } from "model/Round"
import { RootState } from "./caches"

const initialState: GameState = {
    revision: -1,
    iamSpectator: true,
    isMyGo: false,
    iamGoer: false,
    iamDealer: false,
    iamAdmin: false,
    cards: [],
    status: GameStatus.NONE,
    players: [],
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        updateGame: (_, action: PayloadAction<GameState>) => action.payload,
        updatePlayers: (state, action: PayloadAction<Player[]>) => {
            state.players = action.payload
        },
        updatePlayedCards: (state, action: PayloadAction<PlayedCard[]>) => {
            if (state.round)
                state.round.currentHand.playedCards = action.payload
        },
        disableActions: state => {
            state.isMyGo = false
        },
        resetGame: () => initialState,
    },
})

export const {
    updateGame,
    disableActions,
    updatePlayedCards,
    updatePlayers,
    resetGame,
} = gameSlice.actions

export const getGame = (state: RootState) => state.game
export const getGamePlayers = createSelector(getGame, game => game.players)
export const getNumPlayers = createSelector(
    getGamePlayers,
    players => players.length,
)
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

export const getMaxCall = createSelector(getGame, game => game.maxCall ?? 0)
export const getIsMyGo = createSelector(getGame, game => game.isMyGo)
export const getIamGoer = createSelector(getGame, game => game.iamGoer)
export const getIamDealer = createSelector(getGame, game => game.iamDealer)
export const getIamAdmin = createSelector(getGame, game => game.iamAdmin)
export const getIHavePlayed = createSelector(getGame, game => {
    const myPosition = game.players.findIndex(p => p.id === game.me?.id)
    const currentPlayerPosition = game.players.findIndex(
        p => p.id === game.round?.currentHand.currentPlayerId,
    )
    return myPosition < currentPlayerPosition
})
export const getIamSpectator = createSelector(
    getGame,
    game => game.iamSpectator,
)

export const haveBoughtCards = createSelector(
    getIsRoundBuying,
    isRoundBuying => isRoundBuying,
)

export const getIsInBunker = createSelector(
    getIsMyGo,
    getIsRoundCalling,
    getMe,
    (isMyGo, isRoundCalling, me) =>
        isMyGo && isRoundCalling && me && me?.score < -30,
)
