import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PlayerProfile } from "model/Player"
import { RootState } from "./caches"

export interface PlayersState {
    players: PlayerProfile[]
}

const initialState: PlayersState = {
    players: [],
}

export const playerProfilesSlice = createSlice({
    name: "playerProfiles",
    initialState: initialState,
    reducers: {
        updatePlayerProfiles: (_, action: PayloadAction<PlayerProfile[]>) => {
            return {
                players: action.payload,
            }
        },
    },
})

export const { updatePlayerProfiles } = playerProfilesSlice.actions

export const getPlayerProfiles = (state: RootState) =>
    state.playerProfiles.players
