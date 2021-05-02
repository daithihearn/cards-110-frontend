import React from 'react'
import auth0Client from '../../Auth'
import { Link } from "react-router-dom"

import { useDispatch } from 'react-redux'

const NavBar = () => {

    const dispatch = useDispatch()

    const signOut = () => {
        auth0Client.signOut()
        clearGame()
    }

    const clearGame = () => {
        dispatch({ type: 'game/exit' })
    }

    return (
        <nav className="navbar navbar-dark bg-primary fixed-top">
            <Link to="/"><div className="linknavbar">Cards</div></Link>
            {
                !auth0Client.isAuthenticated() &&
                <button className="btn btn-dark" onClick={auth0Client.signIn}>Sign In</button>
            }
            {
                auth0Client.isAuthenticated() &&
                <div>
                    <label className="mr-2 text-white"><img alt={auth0Client.getProfile().name} src={auth0Client.getProfile().picture} className="avatar" /></label>
                    <button className="btn btn-dark" onClick={signOut}>Sign Out</button>
                </div>
            }
        </nav>
    )
}

export default NavBar;
