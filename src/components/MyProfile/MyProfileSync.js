
import React from 'react'

import ProfileService from '../../services/ProfileService'
import parseError from '../../utils/ErrorUtils'
import { useDispatch } from 'react-redux'

import { useAuth0 } from "@auth0/auth0-react"
import jwt_decode from "jwt-decode"

const MyProfileSync = () => {

    const dispatch = useDispatch()

    const {
        user,
        getAccessTokenSilently
    } = useAuth0()

    if (!user) return null

    getAccessTokenSilently().then( (accessToken )=> {

        ProfileService.updateProfile({ name: user.name, picture: user.picture }, accessToken).then(myProfile => {

            const decodedAccessToken = jwt_decode(accessToken)
            
            dispatch({
                type: 'myProfile/update', payload: {
                    id: myProfile.data.id,
                    name: myProfile.data.name,
                    picture: myProfile.data.picture,
                    accessToken: accessToken,
                    isPlayer: decodedAccessToken.permissions.indexOf("read:game") !== -1,
                    isAdmin: decodedAccessToken.permissions.indexOf("read:admin") !== -1
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