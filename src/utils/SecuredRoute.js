import React from 'react';
import {Route} from 'react-router-dom';
import auth0Client from '../Auth';
import LoadingIcon from '../../src/assets/img/brand/loading.gif';

function SecuredRoute(props) {
  const {component: Component, path, checkingSession, ...rest} = props;
  return (
    <Route exact path={path} component={() => {
      if (checkingSession) return <img src={LoadingIcon} className="loading" alt="Loading Icon" />;
      if (!auth0Client.isAuthenticated()) {
        auth0Client.signIn();
        return <div></div>;
      }
      return <Component {...rest} />
    }} />
  );
}

export default SecuredRoute;
