import React from 'react';
import {Route} from 'react-router-dom';
import auth0Client from '../Auth';

function SecuredRoute(props) {
  const {component: Component, path, checkingSession, ...rest} = props;
  return (
    <Route exact path={path} component={() => {
      if (checkingSession) return <h3 className="text-center">Validating session...</h3>;
      if (!auth0Client.isAuthenticated()) {
        auth0Client.signIn();
        return <div></div>;
      }
      return <Component {...rest} />
    }} />
  );
}

export default SecuredRoute;
