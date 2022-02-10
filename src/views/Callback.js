import React from 'react'
import auth0Client from '../components/Auth/Auth'
import LoadingIcon from '../../src/assets/img/brand/loading.gif'
import { useHistory } from "react-router-dom"

const Callback = () => {

    const history = useHistory()

    auth0Client.handleAuthentication().then(authResult => {
        console.log("Successful login!")
        history.push('/')
    }).catch(err => {
        console.log(err)
        auth0Client.signIn()
    })

    return (
        <img src={LoadingIcon} className="loading" alt="Loading Icon" />
    )

}

export default Callback
