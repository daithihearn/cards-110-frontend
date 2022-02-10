import { combineReducers } from 'redux'

import myProfileReducer from './components/MyProfile/MyProfileSlice'
import authReducer from './components/Auth/AuthSlice'
import gameReducer from './components/Game/GameSlice'
import gameStatsReducer from './components/GameStats/GameStatsSlice'
import myGamesReducer from './components/MyGames/MyGamesSlice'
import snackbarReducer from './components/Snackbar/SnackbarSlice'
import playersReducer from './components/StartNewGame/PlayersSlice'

const rootReducer = combineReducers({
    myProfile: myProfileReducer,
    auth: authReducer,
    game: gameReducer,
    myGames: myGamesReducer,
    gameStats: gameStatsReducer,
    snackbar: snackbarReducer,
    players: playersReducer
})

export default rootReducer
