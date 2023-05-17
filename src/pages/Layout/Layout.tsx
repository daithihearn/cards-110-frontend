import { useAuth0 } from "@auth0/auth0-react"
import { Outlet } from "react-router"
import { useAppSelector } from "caches/hooks"
import { getAccessToken } from "caches/MyProfileSlice"
import DefaultHeader from "components/Header/Header"
import { useEffect } from "react"
import Loading from "components/icons/Loading"
import { Box } from "@mui/material"

const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE as string
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE as string

const Layout = () => {
    const accessToken = useAppSelector(getAccessToken)
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
        <Box
            component="div"
            className="main_content carpet no-horizontal-scroll">
            <span className="app" style={{ overflowX: "hidden" }}>
                <div className="app_body">
                    <main className="main">
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
