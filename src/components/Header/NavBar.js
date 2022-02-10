import React from 'react'
import auth0Client from '../Auth/Auth'
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'

const NavBar = () => {

    const dispatch = useDispatch()

    const auth = useSelector(state => state.auth)
    if (!auth) { return null }
    const myProfile = useSelector(state => state.myProfile)
    if (!myProfile) { return null }

    const signOut = () => {
        auth0Client.signOut()
        clearGame()
    }

    const clearGame = () => {
        dispatch({ type: 'game/exit' })
    }

    const isAuthenticated = () => {
        return new Date().getTime() < auth.expiresAt
    }

    return (
        <nav className="navbar navbar-dark bg-primary fixed-top">
            <Link to="/"><div className="linknavbar">Cards</div></Link>
            {
                !isAuthenticated() &&
                <button className="btn btn-dark" onClick={auth0Client.signIn}>Sign In</button>
            }
            {
                isAuthenticated() &&
                <div>
                    <label className="mr-2 text-white"><img alt={myProfile.name} src={myProfile.picture} className="avatar" /></label>
                    <button className="btn btn-dark" onClick={signOut}>Sign Out</button>
                </div>
            }
        </nav>
    )
}

export default NavBar;
