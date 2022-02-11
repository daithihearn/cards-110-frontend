
import React from 'react'

import ProfileService from '../../services/ProfileService'
import parseError from '../../utils/ErrorUtils'
import { useDispatch } from 'react-redux'

import { useAuth0 } from "@auth0/auth0-react"

const MyProfileSync = () => {

    const dispatch = useDispatch()

    const {
        user,
        getAccessTokenSilently
    } = useAuth0()

    if (!user) return null

    getAccessTokenSilently().then(accessToken => {
        ProfileService.updateProfile({ name: user.name, picture: user.picture }, accessToken).then(myProfile => {
            dispatch({
                type: 'myProfile/update', payload: {
                    id: myProfile.data.id,
                    name: myProfile.data.name,
                    picture: myProfile.data.picture,
                    isPlayer: true,
                    isAdming: true,
                    accessToken: accessToken
                    // isPlayer: user.scope.indexOf("read:game") !== -1,
                    // isAdmin: user.scope.indexOf("read:admin") !== -1
                }
            })
        }).catch(error => {
            dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
        })
    }).catch(error => {
        dispatch({ type: 'snackbar/message', payload: { type: 'error', message: parseError(error) } })
    })

    return null
}

export default MyProfileSync