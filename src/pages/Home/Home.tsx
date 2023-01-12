import React from "react"

import { Card, CardGroup, CardHeader } from "reactstrap"

import DataLoader from "../../components/DataLoader/DataLoader"
import StartNewGame from "../../components/StartNewGame/StartNewGame"
import MyGames from "../../components/MyGames/MyGames"
import GameStats from "../../components/GameStats/GameStats"
import { withAuthenticationRequired } from "@auth0/auth0-react"

import { useAppSelector } from "../../caches/hooks"
import { getMyProfile } from "../../caches/MyProfileSlice"

const Home = () => {
  const myProfile = useAppSelector(getMyProfile)

  return (
    <>
      <div className="app carpet">
        <DataLoader />
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
    </>
  )
}

export default withAuthenticationRequired(Home)
