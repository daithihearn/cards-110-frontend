const axios = require('axios');

exports.get = (id) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?id=${id}`, config)
    
  }
};

exports.getGame = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/game`, config)
    
  }
};

exports.getAll = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

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
};

exports.getActive = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/active`, config)
    
  }
};

exports.put = (createGame) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game`, createGame, config)
  }
};

exports.finish = (id) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/finish?id=${id}`, null, config)
    
  }
};

exports.cancel = (id) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/cancel?id=${id}`, null, config)
    
  }
};


exports.delete = (id) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios
      .delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?id=${id}`, config)
    
  }
};

exports.replay = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/replay`, null, config)
    
  }
};

exports.deal = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/deal`, null, config)
    
  }
};

exports.call = (call) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/call?call=${call}`, null, config)
    
  }
};

exports.buyCards = (cards) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/buyCards`, cards, config);
  }
};

exports.chooseFromDummy = (cards, suit) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/chooseFromDummy?suit=${suit}`, cards, config);
  }
};

exports.playCard = (card) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    };
    return axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/playCard?card=${card}`, null, config);
  }
};