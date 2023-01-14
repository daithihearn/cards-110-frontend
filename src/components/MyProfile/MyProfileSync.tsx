import React, { useEffect } from "react"

import ProfileService from "../../services/ProfileService"

import { useAuth0 } from "@auth0/auth0-react"
import { useAppDispatch } from "../../caches/hooks"
import { useSnackbar } from "notistack"

const MyProfileSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user, error, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error) enqueueSnackbar(error.message, { variant: "error" })
  }, [error])

  useEffect(() => {
    if (isAuthenticated && user && user.name && user.picture) {
      getAccessTokenSilently()
        .then((accessToken) =>
          dispatch(
            ProfileService.updateProfile(
              {
                name: user.name!,
                picture: user.picture!,
              },
              accessToken
            )
          ).catch((e: Error) =>
            enqueueSnackbar(`Service: ${e.message}`, { variant: "error" })
          )
        )
        .catch((e: Error) =>
          enqueueSnackbar(`AccessToken: ${e.message}`, { variant: "error" })
        )
    }
  }, [user, isAuthenticated])

  return <></>
}

export default MyProfileSync