import auth0Client from '../Auth'
import { triggerBounceMessage, triggerBounceInterval } from '../constants'

const axios = require('axios')

class GameService {

    putEventTime = 0
    finishEventTime = 0
    cancelEventTime = 0
    deleteEventTime = 0
    replayEventTime = 0
    buyCardsEventTime = 0
    dealEventTime = 0
    callEventTime = 0
    playCardEventTime = 0
    chooseFromDummyEventTime = 0
    playCardEventTime = 0

    get = (gameId) => {

        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/game?gameId=${gameId}`, config)
            return result
        }
    }

    getGameState = (gameId) => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            }
            return axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/gameState?gameId=${gameId}`, config)

        }
    }

    getAll = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json"
                }
            }
            return axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/all`, config)

        }
    }

    getMyGames = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json"
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/game/all`, config)
            return result
        }
    }

    getAllPlayers = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json"
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/players/all`, config)
            return result
        }
    }

    getPlayersForGame = (gameId) => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json"
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/game/players?gameId=${gameId}`, config)
            return result
        }
    }

    put = (createGame) => {
        if (Date.now() - this.putEventTime > triggerBounceInterval) {
            this.putEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader
                    }
                }
                const result = axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game`, createGame, config)
                return result
            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    finish = (gameId) => {
        if (Date.now() - this.finishEventTime > triggerBounceInterval) {
            this.finishEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/finish?gameId=${gameId}`, null, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    cancel = (gameId) => {
        if (Date.now() - this.cancelEventTime > triggerBounceInterval) {
            this.cancelEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/cancel?gameId=${gameId}`, null, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })

        }
    }

    delete = (gameId) => {
        if (Date.now() - this.deleteEventTime > triggerBounceInterval) {
            this.deleteEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader
                    }
                }
                return axios
                    .delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?gameId=${gameId}`, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    replay = (gameId) => {
        if (Date.now() - this.replayEventTime > triggerBounceInterval) {
            this.replayEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/replay?gameId=${gameId}`, null, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    deal = (gameId) => {

        if (Date.now() - this.dealEventTime > triggerBounceInterval) {
            this.dealEventTime = Date.now()

            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/deal?gameId=${gameId}`, null, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    call = (gameId, call) => {

        if (Date.now() - this.callEventTime > triggerBounceInterval) {
            this.callEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/call?gameId=${gameId}&call=${call}`, null, config)

            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    buyCards = (gameId, cards) => {

        if (Date.now() - this.buyCardsEventTime > triggerBounceInterval) {
            this.buyCardsEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/buyCards?gameId=${gameId}`, cards, config)
            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    chooseFromDummy = (gameId, cards, suit) => {
        if (Date.now() - this.chooseFromDummyEventTime > triggerBounceInterval) {
            this.chooseFromDummyEventTime = Date.now()
            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/chooseFromDummy?gameId=${gameId}&suit=${suit}`, cards, config)
            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }

    playCard = (gameId, card) => {
        if (Date.now() - this.playCardEventTime > triggerBounceInterval) {
            this.playCardEventTime = Date.now()

            let authHeader = `Bearer ${auth0Client.getAccessToken()}`

            if (authHeader) {
                let config = {
                    headers: {
                        Authorization: authHeader,
                        "Content-Type": "application/json"
                    }
                }
                return axios
                    .put(`${process.env.REACT_APP_API_URL}/api/v1/playCard?gameId=${gameId}&card=${card}`, null, config)
            }
        } else {
            return new Promise((resolve, reject) => {
                throw new Error(triggerBounceMessage)
            })
        }
    }
}

const gameService = new GameService()

export default gameService