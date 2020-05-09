const axios = require('axios');

exports.checkLoggedIn = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  // Check if JWT exists
  if (!authHeader) {
    window.location.href = '/#/login';
    return;
  }

  // Check if session is valid
  let config = {
    headers: {
      Authorization: authHeader
    }
  };
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/v1/session/isLoggedIn`, config)
    .then(function(response) {
      //console.log(`Is user logged in?  ${response.data}`);
    })
    .catch(function(error) {
      console.log(error);
      window.location.href = '/#/login';
    });
};

exports.name = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/session/name`, config);
  }
};

exports.id = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/session/id`, config);
  }
};


exports.logout = () => {
  sessionStorage.clear();
  window.location.href = '/#/login';
};

exports.checkUserType = () => {
  let authHeader = sessionStorage.getItem('JWT-TOKEN');

  // Check if JWT exists
  if (!authHeader) {
    window.location.href = '/#/login';
    return;
  }

  // Check if session is valid
  let config = {
    headers: {
      Authorization: authHeader
    }
  };
  return axios
    .get(`${process.env.REACT_APP_API_URL}/api/v1/session/type`, config);
};

exports.logout = () => {
  sessionStorage.clear();
  window.location.href = '/#/login';
};