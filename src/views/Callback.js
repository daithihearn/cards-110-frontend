import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from '../Auth';
import LoadingIcon from '../../src/assets/img/brand/loading.gif';

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    this.props.history.replace('/');
  }

  render() {
    return (
      <img src={LoadingIcon} className="loading" alt="Loading Icon" />
    );
  }
}

export default withRouter(Callback);
