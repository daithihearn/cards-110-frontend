import axios from 'axios';
import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import queryString from 'query-string'
import { Card, CardBody, CardGroup, Alert } from 'reactstrap';

class AutoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    const values = queryString.parse(this.props.location.search);
    this.attemptLogin(values);
  }

  attemptLogin(details) {
    let thisObj = this;

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, details)
      .then(function (response) {
        sessionStorage.setItem('JWT-TOKEN', response.headers.authorization);
        thisObj.redirectToHomePage();
      }).catch(function (error) {
        thisObj.parseError(error);
      });
  }

  redirectToHomePage() {

    let thisObj = this;

    sessionUtils.checkUserType().then(function(response) {
  
      let authority = response.data[0].authority;
      if (authority === "PLAYER") {

        sessionUtils.id().then(response => {

          thisObj.props.history.push({
            pathname: '/game',
            state: { myId: response.data }
          });
        }).catch(error => {
          thisObj.parseError(error);
        });
      
      } else if (authority === "ADMIN") {
        window.location.href = '/#/home';
      } else {
        window.location.href = '/#/login';
      }
    })
    .catch(function(error) {
      console.log(error);
      window.location.href = '/#/login';
    });
  }

  parseError(error) {
    let errorMessage = 'Undefined error';
    if (
      typeof error.response !== 'undefined' &&
      typeof error.response.data !== 'undefined' &&
      typeof error.response.data.message !== 'undefined' &&
      error.response.data.message !== ''
    ) {
      errorMessage = error.response.data.message;
    } else if (
      typeof error.response !== 'undefined' &&
      typeof error.response.statusText !== 'undefined' &&
      error.response.statusText !== ''
    ) {
      errorMessage = error.response.statusText;
    }
    if (typeof error.message !== 'undefined') {
      errorMessage = error.message;
    }
    this.setState(Object.assign(this.state, {_error: errorMessage}));
  }

  showError() {
    if (!this.state._error) {
      return false;
    }
    return true;
  }

  readErrorMessage() {
    if (!this.state._error) {
      return '';
    }
    let error = this.state._error;
    delete this.state._error;
    return error;
  }

  render() {
    return (
      <div className="app">
        <div className="game_wrap">
          <div className="game_container">
          <CardGroup>
            <Card className="p-6">
                { this.showError() ?
                    
                        <CardBody>
                          <Alert className="mt-3" color="danger" isOpen={this.showError()}>
                            {this.readErrorMessage()}
                          </Alert>
                        </CardBody>
                      
                  : <h2>Attempting login....</h2>}
              </Card>
            </CardGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default AutoLogin;
