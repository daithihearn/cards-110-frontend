import React from "react"

import { Card, CardHeader, Grid } from "@mui/material"
import StartNewGame from "components/StartNewGame/StartNewGame"
import MyGames from "components/MyGames/MyGames"
import GameStats from "components/GameStats/GameStats"
import { withAuthenticationRequired } from "@auth0/auth0-react"

import useAccessToken from "auth/accessToken"

const Home = () => {
    const { isPlayer, isAdmin } = useAccessToken()

    return (
        <div className="app">
            <div className="game-wrap">
                <div className="game-container">
                    {!isPlayer && !isAdmin ? (
                        <Grid container>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title="You are successfully logged in but don't yet have any access permissions. Please contact Daithi to get access." />
                                </Card>
                            </Grid>
                        </Grid>
                    ) : (
                        <div>
                            {isPlayer ? (
                                <Grid container sx={{ marginBottom: "10px" }}>
                                    <MyGames />
                                </Grid>
                            ) : null}

                            {isPlayer && !isAdmin ? (
                                <Grid container>
                                    <GameStats />
                                </Grid>
                            ) : null}
                            {isAdmin ? <StartNewGame /> : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default withAuthenticationRequired(Home)
