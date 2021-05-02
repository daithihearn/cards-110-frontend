import React from 'react'
import profileService from '../../services/ProfileService'
import DefaultHeader from '../Header/Header'
import { useSelector, useDispatch } from 'react-redux'

import { Card, CardGroup, CardHeader } from 'reactstrap'

import auth0Client from '../../Auth'
import MySnackbar from '../Snackbar/MySnackbar'
import DataLoader from '../DataLoader/DataLoader'
import StartNewGame from '../StartNewGame/StartNewGame'
import MyGames from '../MyGames/MyGames'
import Game from '../Game/Game'

const Home = () => {

  const game = useSelector(state => state.game.game)

  // Update Player Profile
  // TODO: Move this something more appropriate
  const profile = auth0Client.getProfile();
  profileService.updateProfile({ name: profile.name, email: profile.email, picture: profile.picture });

  return (
    <div>
      <DataLoader />
      <div className="main_content">
        <span className="app" style={{ overflowX: 'hidden' }}>
          <div className="app_body">
            <main className="main">
              <DefaultHeader />
              <MySnackbar />


              <div className="app carpet">
                <div className="game_wrap">
                  <div className="game_container">

                    {!!game && !!game.status ? <Game /> :
                      <div>
                        {!auth0Client.isPlayer() && !auth0Client.isAdmin() ?
                          <CardGroup>
                            <Card color="secondary" className="p-6">
                              <CardHeader tag="h2">You are successfully logged in but don't yet have any access permissions. Please contact Daithi to get access.</CardHeader>
                            </Card>
                          </CardGroup>
                          :
                          <div>
                            {/* PLAYER - Section - START */}
                            {auth0Client.isPlayer() ?

                              <MyGames />

                              : null}
                            {/* PLAYER - Section - END */}


                            {/* ADMIN - Section - START */}
                            {auth0Client.isAdmin() ?
                              <div>

                                {/* ADMIN - Start a new Game - START */}

                                <StartNewGame />

                                {/* ADMIN - Start a new Game - START */}

                              </div>
                              : null}
                            {/* ADMIN - Section - END */}
                          </div>
                        }

                      </div>
                    }
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

export default Home;
