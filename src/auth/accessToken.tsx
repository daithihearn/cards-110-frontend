import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useMemo, useState } from "react"
import { jwtDecode } from "jwt-decode"

const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE as string
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE as string

interface JWTToken {
    permissions: string[]
}

const useAccessToken = () => {
    const [accessToken, setAccessToken] = useState<string | undefined>()
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        if (isAuthenticated && user) {
            getAccessTokenSilently({
                authorizationParams: {
                    audience: AUTH0_AUDIENCE,
                    redirect_uri: window.location.origin,
                    scope: AUTH0_SCOPE,
                },
            }).then(token => {
                setAccessToken(token)
            })
        }
    }, [user, isAuthenticated, getAccessTokenSilently])

    const isPlayer = useMemo(() => {
        if (!accessToken) {
            return false
        }
        const decodedAccessToken = jwtDecode<JWTToken>(accessToken)
        return decodedAccessToken.permissions.indexOf("read:game") !== -1
    }, [accessToken])

    const isAdmin = useMemo(() => {
        if (!accessToken) {
            return false
        }
        const decodedAccessToken = jwtDecode<JWTToken>(accessToken)
        return decodedAccessToken.permissions.indexOf("write:admin") !== -1
    }, [accessToken])

    return { isPlayer, isAdmin, accessToken: accessToken }
}

export default useAccessToken
