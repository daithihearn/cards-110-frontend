import React from "react"
import GameWrapper from "components/Game/GameWrapper"
import GameOver from "components/Game/GameOver"

import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useParams } from "react-router-dom"

import { useGameState } from "components/Hooks/useGameState"
import { useAppSelector } from "caches/hooks"
import { getIsGameActive, getIsGameCompleted } from "caches/GameSlice"

const Game = () => {
    let { id } = useParams<string>()
    useGameState(id)
    const isGameActive = useAppSelector(getIsGameActive)
    const isGameCompleted = useAppSelector(getIsGameCompleted)

    return (
        <div className="app">
            <div className="game-wrap">
                <div className="game-container">
                    {isGameActive && <GameWrapper />}
                    {isGameCompleted && <GameOver />}
                </div>
            </div>
        </div>
    )
}

export default withAuthenticationRequired(Game)
