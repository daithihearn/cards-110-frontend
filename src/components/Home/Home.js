import React from "react"
import DefaultHeader from "../Header/Header"

import { Card, CardGroup, CardHeader } from "reactstrap"

import MySnackbar from "../Snackbar/MySnackbar"
import DataLoader from "../DataLoader/DataLoader"
import StartNewGame from "../StartNewGame/StartNewGame"
import MyGames from "../MyGames/MyGames"
import GameStats from "../GameStats/GameStats"
import { useAuth0 } from "@auth0/auth0-react"

import { useSelector } from "react-redux"
import LoadingIcon from "../../assets/img/brand/loading.gif"

const loading = () => {
  return <img src={LoadingIcon} className="loading" alt="Loading Icon" />
}

const Home = (props) => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0()

  if (isLoading) return loading()
  if (error) throw Error(error)
  if (!isAuthenticated) return loginWithRedirect()

  const myProfile = useSelector((state) => state.myProfile)
  if (!myProfile.id) return loading()

  return (
    <div>
      <DataLoader />
      <div className="main_content">
        <span className="app" style={{ overflowX: "hidden" }}>
          <div className="app_body">
            <main className="main">
              <DefaultHeader />
              <MySnackbar />

              <div className="app carpet">
                <div className="game_wrap">
                  <div className="game_container">
                    {!myProfile.isPlayer && !myProfile.isAdmin ? (
                      <CardGroup>
                        <Card color="secondary" className="p-6">
                          <CardHeader tag="h2">
                            You are successfully logged in but don't yet have
                            any access permissions. Please contact Daithi to get
                            access.
                          </CardHeader>
                        </Card>
                      </CardGroup>
                    ) : (
                      <div>
                        {/* PLAYER - Section - START */}
                        {myProfile.isPlayer ? (
                          <div>
                            <MyGames history={props.history} />
                            <GameStats />
                          </div>
                        ) : null}
                        {/* PLAYER - Section - END */}

                        {/* ADMIN - Section - START */}
                        {myProfile.isAdmin ? (
                          <div>
                            {/* ADMIN - Start a new Game - START */}

                            <StartNewGame />

                            {/* ADMIN - Start a new Game - START */}
                          </div>
                        ) : null}
                        {/* ADMIN - Section - END */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </span>
      </div>
    </div>
  )
}

export default Home
