import React, { useCallback, useEffect } from "react"

import { Card, CardGroup, CardHeader } from "reactstrap"

import StartNewGame from "../../components/StartNewGame/StartNewGame"
import MyGames from "../../components/MyGames/MyGames"
import GameStats from "../../components/GameStats/GameStats"
import { withAuthenticationRequired } from "@auth0/auth0-react"
import PullToRefresh from "react-simple-pull-to-refresh"

import { useAppDispatch, useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"
import GameService from "../../services/GameService"
import { useSnackbar } from "notistack"
import StatsService from "../../services/StatsService"
import Loading from "../../components/icons/Loading"

const Home = () => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(getMyProfile)
  const { enqueueSnackbar } = useSnackbar()

  const fetchData = async () => {
    if (myProfile.isAdmin)
      await dispatch(GameService.getAllPlayers()).catch((e: Error) =>
        enqueueSnackbar(e.message, { variant: "error" })
      )

    await dispatch(GameService.getAll())

    await dispatch(StatsService.gameStatsForPlayer()).catch((e: Error) =>
      enqueueSnackbar(e.message, { variant: "error" })
    )
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <PullToRefresh onRefresh={fetchData} refreshingContent={<Loading />}>
      <div className="app carpet">
        <div className="game_wrap">
          <div className="game_container">
            {!myProfile.isPlayer && !myProfile.isAdmin ? (
              <CardGroup>
                <Card color="secondary" className="p-6">
                  <CardHeader tag="h2">
                    You are successfully logged in but don't yet have any access
                    permissions. Please contact Daithi to get access.
                  </CardHeader>
                </Card>
              </CardGroup>
            ) : (
              <div>
                {myProfile.isPlayer ? (
                  <div>
                    <MyGames />
                    <GameStats />
                  </div>
                ) : null}
                {myProfile.isAdmin ? (
                  <div>
                    <StartNewGame />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}

export default withAuthenticationRequired(Home)
