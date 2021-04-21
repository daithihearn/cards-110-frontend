import { combineReducers } from 'redux'

import activeGamesReducer from './components/ActiveGames/ActiveGamesSlice'

const rootReducer = combineReducers({
  activeGames: activeGamesReducer
})

export default rootReducer
