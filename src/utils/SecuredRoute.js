import React from 'react'
import { Route } from 'react-router-dom'
import auth0Client from '../components/Auth/Auth'
import LoadingIcon from '../../src/assets/img/brand/loading.gif'
import { useDispatch, useSelector } from 'react-redux'
import profileService from '../services/ProfileService'

const SecuredRoute = (props) => {

    const dispatch = useDispatch()

    const attemptToAuthorize = () => {

        auth0Client.silentAuth().then(authResult => {

            dispatch({
                type: 'auth/update', payload: {
                    idToken: authResult.idToken,
                    accessToken: authResult.accessToken,
                    scope: authResult.scope,
                    expiresAt: authResult.idTokenPayload.exp * 1000
                }
            })
            profileService.updateProfile({ name: authResult.idTokenPayload.name, picture: authResult.idTokenPayload.picture }, authResult.accessToken).then(myProfile => {
                dispatch({
                    type: 'myProfile/update', payload: {
                        id: myProfile.data.id,
                        name: myProfile.data.name,
                        picture: myProfile.data.picture,
                        isPlayer: authResult.scope.indexOf("read:game") !== -1,
                        isAdmin: authResult.scope.indexOf("read:admin") !== -1
                    }
                })
            }).catch(err => {
                console.log(err)
                auth0Client.signIn()
            })
        }).catch(err => {
            console.log(err)
            auth0Client.signIn()
        })
    }

    const auth = useSelector(state => state.auth)
    if (!auth.accessToken) {
        attemptToAuthorize()
        return null
    }

    const { component: Component, path, ...rest } = props

    return (
        <Route exact path={path} component={() => {
            if (!auth.accessToken) return <img src={LoadingIcon} className="loading" alt="Loading Icon" />
            if (new Date().getTime() > auth.expiresAt) {
                auth0Client.signIn();
                return <div>Not authenticated...</div>;
            }
            return <Component {...rest} />
        }} />
    )
}

export default SecuredRoute
