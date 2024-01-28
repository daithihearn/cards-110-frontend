import {
    AnyAction,
    combineReducers,
    configureStore,
    Reducer,
} from "@reduxjs/toolkit"

import { gameSlice } from "./GameSlice"
import { playCardSlice } from "./PlayCardSlice"

const combinedReducer = combineReducers({
    game: gameSlice.reducer,
    playCard: playCardSlice.reducer,
})

export type RootState = ReturnType<typeof combinedReducer>

export const rootReducer: Reducer = (state: RootState, action: AnyAction) =>
    combinedReducer(state, action)

export const store = configureStore({
    reducer: rootReducer,
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
