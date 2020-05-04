import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import DataTable, { createTheme } from 'react-data-table-component';
import PlayImage from '../../assets/icons/play.png';
import { Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import ReactPlayer from 'react-player'
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    sessionUtils.checkLoggedIn();
    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

  handleClose() {
    this.updateState({ snackOpen: false });
  }

  handleWebsocketMessage(payload) {

    let publishContent = JSON.parse(payload.payload);
    this.parseScreenContent(publishContent);
    
  }

  parseScreenContent(content) {
    if (!content) {
      return
    }

    switch (content.type) {
      case("LEADERBOARD"):
        this.updateState({leaderboard: content.content});
        break;
      default:
        this.parseError({message: "Unsupported content type"})
    }
  }

  handleChange(event) {
    let key = event.target.getAttribute("name");
    let updateObj = { [key]: event.target.value };
    this.updateState(updateObj);
  }

  parseError(error) {
    let errorMessage = 'Undefined error';
    if (
      error.response !== undefined &&
      error.response.data !== undefined &&
      error.response.data.message !== undefined &&
      error.response.data.message !== ''
    ) {
      errorMessage = error.response.data.message;
    } else if (
      error.response !== undefined &&
      error.response.statusText !== undefined &&
      error.response.statusText !== ''
    ) {
      errorMessage = error.response.statusText;
    } else if (error.message !== undefined) {
      errorMessage = error.message;
    }
    this.updateState({ snackOpen: true, snackMessage: errorMessage, snackType: "error" });
  }

  render() {
   
    return (
      <div className="app">
         <div className="game_wrap">
          <div className="game_container">

              <CardGroup>
                <Card className="p-6">
                    <CardHeader tag="h1">Game</CardHeader>
                    <CardBody>
                      The game will be played here
                    </CardBody>
                </Card>
              </CardGroup>


          {!!this.state.scores ? 

            <CardGroup>
              <Card className="p-6">
                <CardHeader tag="h1">Scores</CardHeader>
                <CardBody>
                  <DataTable
                    defaultSortField="score"
                    defaultSortAsc={false}
                    columns={[
                      {
                        name: 'Player',
                        selector: 'playerId',
                        sortable: true,
                      },
                      {
                        name: 'Score',
                        selector: 'score',
                        sortable: true,
                        right: true,
                      },
                    ]}
                      data={this.state.leaderboard.scores}
                      theme="solarized"
                  />
                </CardBody>
              </Card>
            </CardGroup>

          : null
        }

      <SockJsClient url={ process.env.REACT_APP_API_URL + '/websocket?tokenId=' + sessionStorage.getItem("JWT-TOKEN")} topics={['/game', '/user/game']}
                onMessage={ this.handleWebsocketMessage.bind(this) }
                ref={ (client) => { this.clientRef = client }}/>


        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={ this.state.snackOpen }
          autoHideDuration={6000}
          onClose={this.handleClose.bind(this)}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose.bind(this)}
            variant={ this.state.snackType }
            message={ this.state.snackMessage }
          />
        </Snackbar>

      </div>
    </div>
  </div>
    );
  }
}

export default Game;
