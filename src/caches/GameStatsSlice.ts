import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./caches"

export interface GameStats {
    gameId: string
    timestamp: string
    winner: boolean
    score: number
    rings: number
}

export interface GameStatsState {
    stats: GameStats[]
}

const initialState: GameStatsState = {
    stats: [],
}

export const gameStatsSlice = createSlice({
    name: "gameStats",
    initialState: initialState,
    reducers: {
        updateGameStats: (_, action: PayloadAction<GameStats[]>) => {
            return {
                stats: action.payload,
            }
        },
    },
})

export const { updateGameStats } = gameStatsSlice.actions

export const getGameStats = (state: RootState) => state.gameStats.stats
