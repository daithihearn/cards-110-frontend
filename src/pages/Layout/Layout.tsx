import { useAuth0 } from "@auth0/auth0-react"
import { Outlet } from "react-router"
import DefaultHeader from "components/Header/Header"
import { useEffect } from "react"
import Loading from "components/icons/Loading"
import { Box } from "@mui/material"
import useAccessToken from "auth/accessToken"

const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE as string
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE as string

const Layout = () => {
    const { accessToken } = useAccessToken()
    const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            loginWithRedirect({
                authorizationParams: {
                    audience: AUTH0_AUDIENCE,
                    redirect_uri: window.location.origin,
                    scope: AUTH0_SCOPE,
                },
            })
    }, [isLoading, isAuthenticated])

    return (
        <Box component="div" className="main_content carpet">
            <span className="app">
                <div className="app_body">
                    <main className="main" style={{ overflowX: "hidden" }}>
                        {isAuthenticated && accessToken ? (
                            <>
                                <DefaultHeader />
                                <Outlet />
                            </>
                        ) : (
                            <>
                                <DefaultHeader />
                                <Loading />
                            </>
                        )}
                    </main>
                </div>
            </span>
        </Box>
    )
}

export default Layout
