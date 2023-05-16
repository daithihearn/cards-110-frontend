import React, { useEffect } from "react"

import { Card, CardHeader, Grid } from "@mui/material"
import StartNewGame from "components/StartNewGame/StartNewGame"
import MyGames from "components/MyGames/MyGames"
import GameStats from "components/GameStats/GameStats"
import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useAppDispatch, useAppSelector } from "caches/hooks"
import { getMyProfile } from "caches/MyProfileSlice"
import GameService from "services/GameService"
import { useSnackbar } from "notistack"
import StatsService from "services/StatsService"
import parseError from "utils/ErrorUtils"

const Home = () => {
    const dispatch = useAppDispatch()
    const myProfile = useAppSelector(getMyProfile)
    const { enqueueSnackbar } = useSnackbar()

    const fetchData = async () => {
        if (myProfile.isAdmin)
            await dispatch(GameService.getAllPlayers()).catch((e: Error) =>
                enqueueSnackbar(parseError(e), { variant: "error" }),
            )

        await dispatch(GameService.getAll())

        await dispatch(StatsService.gameStatsForPlayer()).catch((e: Error) =>
            enqueueSnackbar(parseError(e), { variant: "error" }),
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="app carpet">
            <div className="game_wrap">
                <div className="game_container">
                    {!myProfile.isPlayer && !myProfile.isAdmin ? (
                        <Grid container>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title="You are successfully logged in but don't yet have any access permissions. Please contact Daithi to get access." />
                                </Card>
                            </Grid>
                        </Grid>
                    ) : (
                        <div>
                            {myProfile.isPlayer ? (
                                <Grid container>
                                    <MyGames />
                                </Grid>
                            ) : null}
                            {myProfile.isPlayer && !myProfile.isAdmin ? (
                                <Grid container>
                                    <GameStats />
                                </Grid>
                            ) : null}
                            {myProfile.isAdmin ? <StartNewGame /> : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default withAuthenticationRequired(Home)
