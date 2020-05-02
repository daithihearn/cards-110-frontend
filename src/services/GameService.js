const axios = require('axios');

exports.get = (id) => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    const result = axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?id=${id}`, config)
    return result;
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
    const result = axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/all`, config)
    return result;
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
    const result = axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/active`, config)
    return result;
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
    const result = axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game`, createGame, config)
    return result;
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
    const result = axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/finish?id=${id}`, null, config)
    return result;
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
    const result = axios
      .put(`${process.env.REACT_APP_API_URL}/api/v1/admin/game/cancel?id=${id}`, null, config)
    return result;
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
    const result = axios
      .delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/game?id=${id}`, config)
    return result;
  }
};