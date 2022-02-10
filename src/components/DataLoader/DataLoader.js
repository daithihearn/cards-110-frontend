import { useDispatch, useSelector } from 'react-redux'
import GameService from '../../services/GameService'
import StatsService from '../../services/StatsService'

import parseError from '../../utils/ErrorUtils'

import { triggerBounceMessage } from '../../constants'

const DataLoader = () => {
    const dispatch = useDispatch()
    const myProfile = useSelector(state => state.myProfile)
    if (!myProfile) { return null }
    const accessToken = useSelector(state => state.auth.accessToken)
    if (!accessToken) { return null }

    if (myProfile.isAdmin) {
        GameService.getAllPlayers(accessToken).then(response => {
            dispatch({ type: 'players/updateAll', payload: response.data })
        }).catch(error => {
            if (error.message === triggerBounceMessage) { return }
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })

        })
    }

    GameService.getAll(accessToken).then(response => {
        dispatch({ type: 'myGames/updateAll', payload: response.data })
    }).catch(error => {
        if (error.message === triggerBounceMessage) { return }
        dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })

    })

    StatsService.gameStatsForPlayer(accessToken).then(response => {
        dispatch({ type: 'gameStats/update', payload: response.data })
    }).catch(error => {
        dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
    })

    return null

}

export default DataLoader