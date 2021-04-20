import React, { Component } from 'react';
import profileService from '../../services/ProfileService';
import DefaultHeader from '../Header';

import { Card, CardBody, CardGroup, CardHeader } from 'reactstrap';

import MyGames from '../MyGames';
import ActiveGames from '../ActiveGames';
import StartNewGame from '../StartNewGame';

import auth0Client from '../../Auth';
class Home extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      isAdmin: auth0Client.isAdmin(),
      isPlayer: auth0Client.isPlayer()
    };

    this.updateState = this.updateState.bind(this);
  }
  
  async componentDidMount() {
    let profile = auth0Client.getProfile();

    let stateUpdate = {profile: profile};

    // Player Stuff
    if (this.state.isPlayer) {
      await profileService.updateProfile({ name: profile.name, email: profile.email, picture: profile.picture });
    }

    this.updateState(stateUpdate);
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

  render() {

    return (
      <div>
        <div className="main_content">
          <span className="app" style={{ overflowX: 'hidden' }}>
            <div className="app_body">
              <main className="main">
                <DefaultHeader />


          <div className="app carpet">
            <div className="game_wrap">
                <div className="game_container">

                { !this.state.isPlayer && !this.state.isAdmin ? 
                  <CardGroup>
                    <Card color="secondary" className="p-6">
                      <CardHeader tag="h2">You are successfully logged in but don't yet have any access permissions. Please contact Daithi to get access.</CardHeader>
                    </Card>
                  </CardGroup>
                  :
                  <div>
                    {/* PLAYER - Section - START */}
                    { this.state.isPlayer ?

                      <MyGames {...this.props}/>

                    : null }
                    {/* PLAYER - Section - END */}


                    {/* ADMIN - Section - START */}
                    { this.state.isAdmin ?
                      <div>

                      {/* ADMIN - Active Games - START */}

                        <ActiveGames {...this.props}/>

                      {/* ADMIN - Active Games -END */}

                      {/* ADMIN - Start a new Game - START */}
                        
                        <StartNewGame {...this.props} />

                  {/* ADMIN - Start a new Game - START */}

                  </div>
                : null }
                 {/* ADMIN - Section - END */}
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
   
    );
  }
}

export default Home;
