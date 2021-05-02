import auth0Client from '../Auth';

const axios = require('axios');

class GameService {

  get = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      const result = axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?gameId=${gameId}`, config)
      return result;
    }
  }

  getGameForPlayer = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/game?gameId=${gameId}`, config)

    }
  }

  getAll = () => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/all`, config)

    }
  }

  getMyActive = () => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      const result = axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/game/active`, config)
      return result;
    }
  }

  getAllPlayers = () => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      const result = axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/players/all`, config)
      return result;
    }
  }

  getPlayersForGame = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      const result = axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/game/players?gameId=${gameId}`, config)
      return result;
    }
  }

  put = (createGame) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      const result = axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game`, createGame, config)
      return result;
    }
  }

  finish = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/finish?gameId=${gameId}`, null, config)

    }
  }

  cancel = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/cancel?gameId=${gameId}`, null, config)

    }
  }

  delete = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader
        }
      };
      return axios
        .delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?gameId=${gameId}`, config)

    }
  }

  replay = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/replay?gameId=${gameId}`, null, config)

    }
  }

  deal = (gameId) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/deal?gameId=${gameId}`, null, config)

    }
  }

  call = (gameId, call) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/call?gameId=${gameId}&call=${call}`, null, config)

    }
  }

  buyCards = (gameId, cards) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/buyCards?gameId=${gameId}`, cards, config);
    }
  }

  chooseFromDummy = (gameId, cards, suit) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/chooseFromDummy?gameId=${gameId}&suit=${suit}`, cards, config);
    }
  }

  playCard = (gameId, card) => {
    let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      };
      return axios
        .put(`${process.env.REACT_APP_API_URL}/api/v1/playCard?gameId=${gameId}&card=${card}`, null, config);
    }
  }
}

const gamesService = new GameService();

export default gamesService;