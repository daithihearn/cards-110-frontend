import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./caches"
import { PlayerSettings } from "model/PlayerSettings"

const initialState: PlayerSettings = {
    autoBuyCards: false,
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState: initialState,
    reducers: {
        updateSettings: (_, action: PayloadAction<PlayerSettings>) =>
            action.payload,
    },
})

export const { updateSettings } = settingsSlice.actions

export const getSettings = (state: RootState) => state.settings
