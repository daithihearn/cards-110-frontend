import React, { useEffect } from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { useSnackbar } from "notistack"
import { useProfiles } from "components/Hooks/useProfiles"

const MyProfileSync: React.FC = () => {
    const { updateProfile } = useProfiles()
    const { user, error, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (error) enqueueSnackbar(error.message, { variant: "error" })
    }, [error])

    useEffect(() => {
        if (isAuthenticated && user && user.name && user.picture) {
            updateProfile({ name: user.name, picture: user.picture })
        }
    }, [user, isAuthenticated, getAccessTokenSilently])

    return <></>
}

export default MyProfileSync
