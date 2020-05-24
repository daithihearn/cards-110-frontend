import { AppSidebar } from '@coreui/react';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DefaultFooter from '../../components/Footer/Footer';
import Nav from '../../components/Nav/Nav.js';
import DefaultHeader from '../../containers/Header';
import routes from '../../routes';
import sessionUtils from '../../utils/SessionUtils';

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    sessionUtils.checkLoggedIn();
  }
  render() {
    return (
      <div>
        <div className="content_employee">
          <span>
            <AppSidebar className=".sidebar-show" fixed display="md">
              <Nav />
            </AppSidebar>
          </span>
          <span className="app" style={{ overflowX: 'hidden' }}>
            <div className="app_body">
              <main className="main">
                <DefaultHeader />
                {this.props.search === true ? (
                  <div />
                ) : (
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => <route.component {...props} />}
                        />
                      ) : null;
                    })}
                    <Redirect from="/" to="/home" />
                  </Switch>
                )}
              </main>
            </div>
            <DefaultFooter />
          </span>
        </div>
      </div>
    );
  }
}
export default DefaultLayout;