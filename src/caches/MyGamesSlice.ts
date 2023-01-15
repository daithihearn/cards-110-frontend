import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Game } from "../model/Game"
import { RootState } from "./caches"

export interface MyGamesState {
    games: Game[]
}

const initialState: MyGamesState = {
    games: [],
}

export const myGamesSlice = createSlice({
    name: "myGames",
    initialState: initialState,
    reducers: {
        updateMyGames: (_, action: PayloadAction<Game[]>) => {
            return {
                games: action.payload,
            }
        },
        addMyGame: (state, action: PayloadAction<Game>) => {
            return {
                games: state.games.concat(action.payload),
            }
        },
        removeMyGame: (state, action: PayloadAction<string>) => {
            let updated = [...state.games]
            let idx = updated.findIndex(x => x.id === action.payload)
            if (idx === -1) {
                return state
            }
            updated.splice(idx, 1)
            return {
                games: updated,
            }
        },
    },
})

export const { updateMyGames, addMyGame, removeMyGame } = myGamesSlice.actions

export const getMyGames = (state: RootState) => state.myGames.games
