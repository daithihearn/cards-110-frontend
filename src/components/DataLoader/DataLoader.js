import { useDispatch } from 'react-redux'
import GameService from '../../services/GameService'

import parseError from '../../utils/ErrorUtils'

import auth0Client from '../../Auth'
import { triggerBounceMessage } from '../../constants'

const DataLoader = () => {
    const dispatch = useDispatch()

    if (auth0Client.isAdmin()) {
        GameService.getAllPlayers().then(response => {
            dispatch({ type: 'players/updateAll', payload: response.data })
        }).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })

        })
    }

    GameService.getMyActive().then(response => {
        dispatch({ type: 'myGames/updateAll', payload: response.data })
    }).catch(error => {
        if (error.message === triggerBounceMessage) { return }
        dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })

    })

    return null

}

export default DataLoader