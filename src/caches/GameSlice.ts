import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { GameState, GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"
import { RootState } from "./caches"
import { processOrderedCardsAfterGameUpdate } from "utils/GameUtils"
import { Card, CARDS, EMPTY } from "model/Cards"
import { determineEvent } from "utils/EventUtils"
import { Event } from "model/Events"

export const initialGameState: GameState = {
    revision: -1,
    iamSpectator: true,
    isMyGo: false,
    iamGoer: false,
    iamDealer: false,
    iamAdmin: false,
    cards: [],
    cardsFull: [],
    status: GameStatus.NONE,
    players: [],
    event: Event.Unknown,
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialGameState,
    reducers: {
        updateGame: (state, action: PayloadAction<GameStateResponse>) => {
            if (action.payload.id !== state.id) {
                return {
                    ...action.payload,
                    cardsFull: (action.payload.cards ?? []).map(c => CARDS[c]),
                    event: Event.Unknown,
                }
            }
            const updatedGame: GameState = {
                ...action.payload,
                cardsFull: processOrderedCardsAfterGameUpdate(
                    state.cardsFull,
                    action.payload.cards,
                ),
                event: determineEvent(state, action.payload),
            }

            return updatedGame
        },
        selectCard: (state, action: PayloadAction<Card>) => {
            state.cardsFull.forEach(c => {
                if (c.name === action.payload.name) c.selected = true
            })
        },
        selectCards: (state, action: PayloadAction<Card[]>) => {
            state.cardsFull.forEach(c => {
                if (action.payload.some(a => a.name === c.name))
                    c.selected = true
            })
        },
        toggleSelect: (state, action: PayloadAction<Card>) =>
            state.cardsFull.forEach(c => {
                if (c.name === action.payload.name) c.selected = !c.selected
            }),
        toggleUniqueSelect: (state, action: PayloadAction<Card>) =>
            state.cardsFull.forEach(c => {
                if (c.name === action.payload.name) c.selected = !c.selected
                else c.selected = false
            }),
        selectAll: state => {
            state.cardsFull.forEach(c => {
                if (c.name !== EMPTY.name) c.selected = true
            })
        },
        clearSelectedCards: state => {
            state.cardsFull.forEach(c => {
                c.selected = false
            })
        },
        replaceMyCards: (state, action: PayloadAction<Card[]>) => {
            state.cardsFull = action.payload
        },
        resetGame: () => initialGameState,
    },
})

export const {
    updateGame,
    resetGame,
    toggleSelect,
    toggleUniqueSelect,
    selectCard,
    selectCards,
    selectAll,
    clearSelectedCards,
    replaceMyCards,
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
export const getCardsFull = createSelector(getGame, game => game.cardsFull)
export const getCardsWithoutBlanks = createSelector(getCardsFull, cards =>
    cards.filter(c => c.name !== EMPTY.name),
)
export const getSelectedCards = createSelector(getCardsFull, cards =>
    cards.filter(c => c.selected),
)

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

export const getIsGameCompleted = createSelector(
    getGameStatus,
    status => status === GameStatus.COMPLETED,
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

export const getRevision = createSelector(getGame, game => game.revision)
export const getEvent = createSelector(getGame, game => game.event)
