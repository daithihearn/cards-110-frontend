// Styles
// Bootstrap styles
import "bootstrap/dist/css/bootstrap.css"
// CoreUI Icons Set
import "@coreui/icons/css/all.min.css"
// Import Flag Icons Set
// import "flag-icon-css/css/flag-icon.min.css"
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css"
import React from "react"
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom"

// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css"
// Import Main styles for this application
import "./scss/style.scss"

import { Auth0Provider } from "@auth0/auth0-react"
import MyProfileSync from "./components/MyProfile/MyProfileSync"
import { SnackbarProvider } from "notistack"

import { store } from "./caches/caches"
import { Provider } from "react-redux"
import Home from "./pages/Home/Home"
import Game from "./pages/Game/Game"
import Layout from "./pages/Layout/Layout"
import ErrorPage from "./pages/Error/Error"

const AUTHO_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN as string
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE as string
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID as string
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE as string

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route errorElement={<ErrorPage />}>
                <Route path={"/"} element={<Home />} />
                <Route path="/game/:id" element={<Game />} />
            </Route>
        </Route>,
    ),
)

const App = () => {
    return (
        <Provider store={store}>
            <SnackbarProvider maxSnack={3}>
                <Auth0Provider
                    domain={AUTHO_DOMAIN}
                    audience={AUTH0_AUDIENCE}
                    clientId={AUTH0_CLIENT_ID}
                    redirectUri={window.location.origin}
                    scope={AUTH0_SCOPE}
                    useRefreshTokens={true}>
                    <MyProfileSync />
                    <RouterProvider router={router} />
                </Auth0Provider>
            </SnackbarProvider>
        </Provider>
    )
}
export default App
