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
import SettingsService from "services/SettingsService"
import { Spa } from "@mui/icons-material"

const Home = () => {
    const dispatch = useAppDispatch()
    const myProfile = useAppSelector(getMyProfile)
    const { enqueueSnackbar } = useSnackbar()

    const getSettings = async () => {
        await dispatch(SettingsService.getSettings()).catch((e: Error) =>
            enqueueSnackbar(parseError(e), { variant: "error" }),
        )
    }

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

    useEffect(() => {
        getSettings()
    })

    return (
        <div className="app">
            <div className="game-wrap">
                <div className="game-container">
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
                                <Grid container sx={{ marginBottom: "10px" }}>
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
