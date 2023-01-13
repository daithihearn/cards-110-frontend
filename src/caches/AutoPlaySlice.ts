import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Card } from "../model/Cards"
import { RootState } from "./caches"

export interface AutoPlayState {
  card?: string
}

const initialState: AutoPlayState = {}

export const autoPlaySlice = createSlice({
  name: "autoPlay",
  initialState: initialState,
  reducers: {
    updateAutoPlay: (_, action: PayloadAction<Card>) => {
      return {
        card: action.payload.name,
      }
    },
    toggleAutoPlay: (state, action: PayloadAction<Card>) => {
      if (state.card === action.payload.name) return initialState
      return {
        card: action.payload.name,
      }
    },
    clearAutoPlay: () => initialState,
  },
})

export const { updateAutoPlay, toggleAutoPlay, clearAutoPlay } =
  autoPlaySlice.actions

export const getAutoPlayCard = (state: RootState) => state.autoPlay.card
