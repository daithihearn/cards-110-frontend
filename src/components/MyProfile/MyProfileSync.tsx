import React, { useEffect } from "react"

import ProfileService from "services/ProfileService"

import { useAuth0 } from "@auth0/auth0-react"
import { useAppDispatch } from "caches/hooks"
import { useSnackbar } from "notistack"
import parseError from "utils/ErrorUtils"

const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE as string
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE as string

const MyProfileSync: React.FC = () => {
    const dispatch = useAppDispatch()
    const { user, error, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (error) enqueueSnackbar(error.message, { variant: "error" })
    }, [error])

    const updateProfile = async (name: string, picture: string) => {
        console.log(`DAITHI: Attempting to update profile: ${name}`)
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: AUTH0_AUDIENCE,
                redirect_uri: window.location.origin,
                scope: AUTH0_SCOPE,
            },
        })

        console.log(`DAITHI: Got access token: ${accessToken}`)

        dispatch(
            ProfileService.updateProfile(
                {
                    name,
                    picture,
                },
                accessToken,
            ),
        ).catch((e: Error) =>
            enqueueSnackbar(parseError(e), {
                variant: "error",
            }),
        )
    }

    useEffect(() => {
        console.log(`DAITHI: isAuthenticated: ${isAuthenticated} user: ${user}`)
        if (isAuthenticated && user && user.name && user.picture) {
            updateProfile(user.name, user.picture)
        }
    }, [user, isAuthenticated, getAccessTokenSilently])

    return <></>
}

export default MyProfileSync
