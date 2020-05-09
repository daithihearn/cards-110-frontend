import axios from 'axios';
import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import stateUtils from '../../utils/StateUtils';
import sessionUtils from '../../utils/SessionUtils';
import { Button, ButtonGroup} from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    let authHeader = sessionStorage.getItem('JWT-TOKEN');
    if (authHeader) {
      window.location.href = '/#/home';
      return;
    }
  }

  handleChange = event => {
    let key = event.target.getAttribute('name');
    let updateObj = { [key]: event.target.value };
    this.setState(Object.assign(this.state, updateObj));
  };

  handleSubmit = event => {
    event.preventDefault();

    let data = stateUtils.getDataFromState(this.state);
    let thisObj = this;

    thisObj.setState({ _usernameError: '' });

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, data)
      .then(function (response) {
        sessionStorage.setItem('JWT-TOKEN', response.headers.authorization);
        thisObj.redirectToHomePage();
      }).catch(function (error) {
        console.log(error);
        thisObj.setState(Object.assign(thisObj.state, { _error: thisObj.parseError(error) }));
      });
  };

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
    if (
      typeof error.response !== 'undefined' &&
      typeof error.response.data !== 'undefined' &&
      typeof error.response.data.message !== 'undefined' &&
      error.response.data.message !== ''
    ) {
      return error.response.data.message;
    } else if (
      typeof error.response !== 'undefined' &&
      typeof error.response.statusText !== 'undefined' &&
      error.response.statusText !== ''
    ) {
      return error.response.statusText;
    }
    if (typeof error.message !== 'undefined') {
      return error.message;
    }
    return 'Undefined error';
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

  showResponse() {
    if (!this.state._message) {
      return false;
    }
    return true;
  }

  render() {
    //new login
    return (
      <div className="app">
        <div className="login_background">
          <div className="login_background_cloumn">
            <div className="Logo" />
            <div className="login_background_issuerImage" />
            <div className="form_wrap">
              <div className="form_container">
                <div className="form_container_headerText"> Login </div>
                <div className="form_container_subtext">
                  Cards 110
                </div>
                <form onSubmit={this.handleSubmit}>
                  <Alert className="login_error" isOpen={this.showError()}>
                    {this.readErrorMessage()}
                  </Alert>
                  <input
                    className="username"
                    type="input"
                    name="username"
                    placeholder="Username"
                    autoComplete="Username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    required
                  />

                  <div className="login_error_email">{this.state._usernameError}</div>

                  <input
                    className="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                  <ButtonGroup>
                  <Button
                   type="submit" color="primary" >
                    Login
                    {/* <span>
                      <img
                        style={{ marginLeft: '5px' }}
                        alt="description"
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTUiIGhlaWdodD0iMTUiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iIzg2YmMyNSI+PHBhdGggZD0iTTY4LjgsMTU0LjhoLTExLjQ2NjY3Yy0yLjIxMzA3LDAgLTQuMjMxMiwtMS4yNzg1MyAtNS4xODI5MywtMy4yNzk0N2MtMC45NTE3MywtMi4wMDA5MyAtMC42NTkzMywtNC4zNjg4IDAuNzQ1MzMsLTYuMDg4OGw0OC42MzAxMywtNTkuNDMxNzNsLTQ4LjYzMDEzLC01OS40Mzc0N2MtMS40MDQ2NywtMS43MTQyNyAtMS42OTEzMywtNC4wODIxMyAtMC43NDUzMywtNi4wODg4YzAuOTQ2LC0yLjAwNjY3IDIuOTY5ODcsLTMuMjczNzMgNS4xODI5MywtMy4yNzM3M2gxMS40NjY2N2MxLjcyLDAgMy4zNDgyNywwLjc3NCA0LjQzNzYsMi4xMDQxM2w1MS42LDYzLjA2NjY3YzEuNzI1NzMsMi4xMTU2IDEuNzI1NzMsNS4xNDg1MyAwLDcuMjY0MTNsLTUxLjYsNjMuMDY2NjdjLTEuMDg5MzMsMS4zMjQ0IC0yLjcxNzYsMi4wOTg0IC00LjQzNzYsMi4wOTg0eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                      />
                    </span> 
                    </button>*/}
                    </Button>
                    </ButtonGroup>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
