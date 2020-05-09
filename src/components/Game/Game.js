import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import Snackbar from "@material-ui/core/Snackbar";
import { Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';

class Game extends Component {
  constructor(props) {
    super(props);

    if (!props.location.state) {
      this.state = { myId: sessionStorage.getItem("myId") };
    } else {
      this.state = { myId: props.location.state.myId };
      sessionStorage.setItem("myId", props.location.state.myId );
    }

    
    sessionUtils.checkLoggedIn();

    this.getGame();

    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
  }

  getGame() {
    let thisObj = this;

    gameService.getGame().then(response => {

      let game = response.data;
      let me = game.players.filter(player => player.id === this.state.myId)[0];

      thisObj.setState({ game: game, me: me });
    }).catch(error => {
      thisObj.parseError(error);
    });
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
                  <CardHeader tag="h1">My Cards</CardHeader>
                  { !!this.state.me ?
                    <CardBody>

                      { this.state.me.cards.map(card => 
                        <img src={"/cards/thumbnails/" + card + ".png"}/>
                      )}

                    </CardBody>
                  : <div>No cards found....</div> }
              </Card>
            </CardGroup>

            <CardGroup>
              <Card className="p-6">
                  <CardHeader tag="h1">Players</CardHeader>
                  <CardBody>
                    The game will be played here
                  </CardBody>
              </Card>
            </CardGroup>

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
