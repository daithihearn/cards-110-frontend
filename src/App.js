// Styles
// CoreUI Icons Set
import "@coreui/icons/css/all.min.css"
// Import Flag Icons Set
import "flag-icon-css/css/flag-icon.min.css"
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css"
import React, { Component } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
// import Callback from './views/Callback'
import Loadable from "react-loadable"
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css"
import LoadingIcon from "./assets/img/brand/loading.gif"
// Import Main styles for this application
import "./scss/style.scss"
import { createTheme } from "react-data-table-component"
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react"
import MyProfileSync from "./components/MyProfile/MyProfileSync"
import { useHistory } from "react-router-dom"

function Loading() {
  return <img src={LoadingIcon} className="loading" alt="Loading Icon" />
}

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
)

createTheme("solarized", {
  text: {
    primary: "white",
    secondary: "white",
  },
  background: {
    default: "#636f83",
  },
  context: {
    background: "#636f83",
    text: "white",
  },
  divider: {
    default: "#758297",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "#636fff",
    disabled: "rgba(0,0,0,.12)",
  },
})

const HomePage = Loadable({
  loader: () => import("./components/Home/Home"),
  loading: Loading,
})

const GamePage = Loadable({
  loader: () => import("./components/Game/Game"),
  loading: Loading,
})

const App = () => {
  const history = useHistory()

  const onRedirectCallback = (appState) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      scope={process.env.REACT_APP_AUTH0_SCOPE}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
    >
      <MyProfileSync />
      <Router history={history}>
        <Switch>
          <ProtectedRoute path="/" exact name="Home" component={HomePage} />
          <ProtectedRoute
            path="/game/:id"
            exact
            name="Game"
            component={GamePage}
          />
        </Switch>
      </Router>
    </Auth0Provider>
  )
}
export default App
