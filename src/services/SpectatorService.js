import auth0Client from '../Auth'
import { triggerBounceMessage, triggerBounceInterval } from '../constants'

const axios = require('axios')

class SpectatorService {

    registerEventTime = 0

    register = (gameId) => {
        if (Date.now() - this.registerEventTime > triggerBounceInterval) {
            this.registerEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader
                    }
                }
                const result = axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/spectator/register?gameId=${gameId}`, null, config)
                return result
            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    
}

const spectatorService = new SpectatorService()

export default spectatorService