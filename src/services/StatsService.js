import auth0Client from '../Auth'

const axios = require('axios')

class StatsService {

    gameStatsForPlayer = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/stats/gameStatsForPlayer`, config)
            return result
        }
    }

    
}

const statsService = new StatsService()

export default statsService