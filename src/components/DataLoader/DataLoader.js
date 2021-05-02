import { useDispatch } from 'react-redux'
import gameService from '../../services/GameService'

import parseError from '../../utils/ErrorUtils'

import auth0Client from '../../Auth'

const DataLoader = () => {
    const dispatch = useDispatch()

    if (auth0Client.isAdmin()) {
      gameService.getAllPlayers().then(response => {
        dispatch({ type: 'players/updateAll', payload: response.data })
      }).catch(error => {
        dispatch({ type: 'snackbar/message', payload: {type: 'error', message: parseError(error) }})
      })
    }

    gameService.getMyActive().then(response => {
      dispatch({ type: 'myGames/updateAll', payload: response.data })
    }).catch(error => {
        dispatch({ type: 'snackbar/message', payload: {type: 'error', message: parseError(error)}})
    });

    return null

}

export default DataLoader