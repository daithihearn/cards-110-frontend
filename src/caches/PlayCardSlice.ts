import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Card } from "model/Cards"
import { RootState } from "./caches"

export interface AutoPlayState {
    card?: string
}

const initialState: AutoPlayState = {}

export const playCardSlice = createSlice({
    name: "playCard",
    initialState: initialState,
    reducers: {
        updateCardToPlay: (_, action: PayloadAction<Card>) => {
            return {
                card: action.payload.name,
            }
        },
        togglePlayCard: (state, action: PayloadAction<Card>) => {
            if (state.card === action.payload.name) return initialState
            return {
                card: action.payload.name,
            }
        },
        clearAutoPlay: () => initialState,
    },
})

export const { updateCardToPlay, togglePlayCard, clearAutoPlay } =
    playCardSlice.actions

export const getCardToPlay = (state: RootState) => state.playCard.card
