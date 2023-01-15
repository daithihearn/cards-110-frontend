import {
    Action,
    AnyAction,
    combineReducers,
    configureStore,
    Reducer,
    ThunkDispatch,
} from "@reduxjs/toolkit"

import { myProfileSlice } from "./MyProfileSlice"
import { gameSlice } from "./GameSlice"
import { gameStatsSlice } from "./GameStatsSlice"
import { myGamesSlice } from "./MyGamesSlice"
import { myCardsSlice } from "./MyCardsSlice"
import { autoPlaySlice } from "./AutoPlaySlice"
import { playerProfilesSlice } from "./PlayerProfilesSlice"

const combinedReducer = combineReducers({
    myProfile: myProfileSlice.reducer,
    game: gameSlice.reducer,
    myGames: myGamesSlice.reducer,
    gameStats: gameStatsSlice.reducer,
    playerProfiles: playerProfilesSlice.reducer,
    myCards: myCardsSlice.reducer,
    autoPlay: autoPlaySlice.reducer,
})

export type RootState = ReturnType<typeof combinedReducer>

export const rootReducer: Reducer = (state: RootState, action: AnyAction) =>
    combinedReducer(state, action)

export const store = configureStore({
    reducer: rootReducer,
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export type GenericThunkAction<
    TReturnType,
    TState,
    TExtraThunkArg,
    TBasicAction extends Action,
> = (
    dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
    getState: () => TState,
    extraArgument: TExtraThunkArg,
) => TReturnType

//Use this when your Thunk is async and has a return type
export type AppThunk<TReturnType> = GenericThunkAction<
    TReturnType,
    RootState,
    unknown,
    Action
>
