import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import Snackbar from "@material-ui/core/Snackbar";
import { Label, Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';

class Game extends Component {
  constructor(props) {
    super(props);

    if (!props.location.state) {
      this.state = { myId: sessionStorage.getItem("myId"), selectedCards: [] };
    } else {
      this.state = { myId: props.location.state.myId, selectedCards: [] };
      sessionStorage.setItem("myId", props.location.state.myId );
    }
    
    sessionUtils.checkLoggedIn();

    this.getGameAndRound();

    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleSuitChange = this.handleSuitChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  getGameAndRound() {
    let thisObj = this;

    gameService.getGameAndRound().then(response => {
      thisObj.updateGameAndRound(thisObj, response.data.first, response.data.second);
    }).catch(error => {
      thisObj.parseError(error);
    });
  }

  call(callAmount, event)  {
    let thisObj = this;
    gameService.call(callAmount).then(response => {
      thisObj.updateGameAndRound(thisObj, response.data.first, response.data.second, `Successfully called ${callAmount}`);
    }).catch(error => thisObj.parseError(error));
  };

  selectFromDummy(event) {
    event.preventDefault();
    let thisObj = this;

    gameService.chooseFromDummy(this.state.selectedCards, this.state.selectedSuit).then(response => {
      thisObj.updateGameAndRound(thisObj, response.data.first, response.data.second, `Cards selected`);
    }).catch(error => thisObj.parseError(error));
  }

  buyCards(event) {
    event.preventDefault();
    let thisObj = this;

    gameService.buyCards(this.state.selectedCards).then(response => {
      thisObj.updateGameAndRound(thisObj, response.data.first, response.data.second, `Bought cards`);
    }).catch(error => thisObj.parseError(error));
  }

  playCard(event) {
    event.preventDefault();
    let thisObj = this;
    let selectedCards = this.state.selectedCards;
    if (selectedCards.length !== 1) {
      this.parseError({message: "Please select exactly one card to play"})
    } else {
      let selectedCard = selectedCards[0];
      gameService.playCard(selectedCard).then(response => {
        thisObj.updateGameAndRound(thisObj, response.data.first, response.data.second, `Played ${selectedCard}`);
      }).catch(error => thisObj.parseError(error));
    }
  }

  handleSelectCard(card) {
    let selectedCards = this.state.selectedCards;
    let indexOfCard = selectedCards.indexOf(card);
    if (indexOfCard != -1) {
      selectedCards.splice(indexOfCard, 1);
    } else {
      selectedCards.push(card);
    }

    this.updateState({selectedCards: selectedCards});
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

  handleSuitChange(changeEvent) {
    this.updateState({
      selectedSuit: changeEvent.target.name
    });
  }

  parseScreenContent(content) {
    if (!content) {
      return
    }

    if(content.type === "GAME_AND_ROUND") {
      this.updateGameAndRound(this, content.content.first, content.content.second);
    } else if(content.type === "LEADERBOARD") {
      this.updateState({leaderboard: content.content});
    } else {
      this.parseError({message: "Unsupported content type"})
    }
  }

  updateGameAndRound(thisObj, game, round, message) {
    let me = game.players.filter(player => player.id === thisObj.state.myId)[0];
    let dummy = game.players.filter(player => player.id === "dummy")[0];
    let maxCall = thisObj.getMaxCall(game.players);
    let newState = {game: game, me: me, dummy: dummy, round: round, maxCall: maxCall, selectedCards: [] }
    if (!!message) {
      newState.snackOpen = true;
      newState.snackMessage = message;
      newState.snackType = "success";
    }
    thisObj.updateState(newState);
  }

  getMaxCall(players) {
    let maxCall = 0;
    players.forEach(element => {
      if (element.call > maxCall) {
        maxCall = element.call;
      }
    });
    return maxCall;
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
                  <CardHeader tag="h1">My Cards {(!!this.state.round && !!this.state.round.currentPlayer && this.state.round.currentPlayer.id === this.state.myId) ? "(My Go!!)":""}</CardHeader>
                  { !!this.state.me ?
                    <div>

                      <CardBody>

                        { !! this.state.round && !!this.state.round.suit ? 
                          <h2>Trumps: {this.state.round.suit}</h2>
                        : null}

                      </CardBody>

                      <CardBody>

                        { this.state.me.cards.map(card => 
                          <Button type="button" color="link" onClick={this.handleSelectCard.bind(this, card)}><img src={"/cards/thumbnails/" + card + ".png"} class={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardSelected"}/></Button>
                        )}

                      </CardBody>

                      {/* FINISHED  */}

                      { !!this.state.game && this.state.game.status === "COMPLETED" ?
                      <CardBody>

                        Game Over
                          
                      </CardBody>
                      : null}

                      {/* Calling  */}

                      { !!this.state.round && this.state.round.status === "CALLING" ?
                      <CardBody>

                          {(!!this.state.round && !!this.state.round.currentPlayer && this.state.round.currentPlayer.id === this.state.myId) ?
                          <ButtonGroup>
                            <Button type="button" color="secondary" onClick={this.call.bind(this, 0)}>Pass</Button>
                            { (this.state.me.id == this.state.round.dealer.id && this.state.maxCall <= 10) || this.state.maxCall < 10 ? <Button type="button" color="primary" onClick={this.call.bind(this, 10)}>Call 10</Button> : null }
                            { (this.state.me.id == this.state.round.dealer.id && this.state.maxCall <= 15) || this.state.maxCall < 15 ? <Button type="button" color="primary" onClick={this.call.bind(this, 15)}>Call 15</Button> : null }
                            { (this.state.me.id == this.state.round.dealer.id && this.state.maxCall <= 20) || this.state.maxCall < 20 ? <Button type="button" color="primary" onClick={this.call.bind(this, 20)}>Call 20</Button> : null }
                            { (this.state.me.id == this.state.round.dealer.id && this.state.maxCall <= 25) || this.state.maxCall < 25 ? <Button type="button" color="primary" onClick={this.call.bind(this, 25)}>Call 25</Button> : null }
                            <Button type="button" color="danger" onClick={this.call.bind(this, 30)}>Jink</Button>
                          </ButtonGroup>
                          : null}
                          
                      </CardBody>
                      : null}

                      {/* Called  */}

                      { !!this.state.round && this.state.round.status === "CALLED" ?
                      <div>

                        {this.state.round.goer.id === this.state.myId ? 
                          <div>
                            { this.state.round.status === "CALLED" && this.state.game.players.filter(player => player.id === "dummy").length > 0 ?
                            <CardBody>
                              { this.state.dummy.cards.map(card => 
                                <Button type="button" color="link" onClick={this.handleSelectCard.bind(this, card)}><img src={"/cards/thumbnails/" + card + ".png"} class={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardSelected"}/></Button>
                              )}

                            </CardBody>
                            : null }
                            <CardBody>
                              <Form onSubmit={this.selectFromDummy.bind(this)}>
                                <legend>Suit</legend>
                                <FormGroup check>
                                  <Label check>
                                    <Input type="radio" name="HEARTS" checked={this.state.selectedSuit === 'HEARTS'} onChange={this.handleSuitChange} />{' '}
                                    Hearts
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label check>
                                    <Input type="radio" name="DIAMONDS" checked={this.state.selectedSuit === 'DIAMONDS'} onChange={this.handleSuitChange} />{' '}
                                    DIAMONDS
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label check>
                                    <Input type="radio" name="SPADES" checked={this.state.selectedSuit === 'SPADES'} onChange={this.handleSuitChange} />{' '}
                                    SPADES
                                  </Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Label check>
                                    <Input type="radio" name="CLUBS" checked={this.state.selectedSuit === 'CLUBS'} onChange={this.handleSuitChange} />{' '}
                                    CLUBS
                                  </Label>
                                </FormGroup>
                                <ButtonGroup>
                                  <Button type="submit" color="primary">Select Cards</Button>
                                </ButtonGroup>
                                
                              </Form>
                            </CardBody>
                          </div>

                        : <CardBody><h2>Waiting for the goer to select from the dummy</h2></CardBody>}
                          
                      </div>
                      : null}

                      {/* BUYING  */}

                      { !!this.state.round && this.state.round.status === "BUYING" ?
                      <CardBody>

                        <Form onSubmit={this.buyCards.bind(this)}>
                          <ButtonGroup>
                            {(!!this.state.round && !!this.state.round.currentPlayer && this.state.round.currentPlayer.id === this.state.myId) ? <Button type="submit" color="primary">Select Cards</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}

                      {/* PLAYING  */}

                      { !!this.state.round && this.state.round.status === "PLAYING" ?
                      <CardBody>

                        <Form onSubmit={this.playCard.bind(this)}>
                          <ButtonGroup>
                            {(!!this.state.round && !!this.state.round.currentPlayer && this.state.round.currentPlayer.id === this.state.myId) ? <Button type="submit" color="primary">Play Card</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}


                    </div>


                  : <div>No cards found....</div> }
              </Card>
            </CardGroup>

            {/* {(!!this.state.round && !!this.state.round.currentHand) ?
            <CardGroup>
              <Card className="p-6">
                  <CardHeader tag="h1">Current Hand</CardHeader>
                  <CardBody>
                        { [...this.state.round.currentHand.keys()].map(card => 
                          <img src={"/cards/thumbnails/" + card + ".png"} class="thumbnail_size" />
                        )}
                  </CardBody>
              </Card>
            </CardGroup>
            : null } */}


            <CardGroup>
              <Card className="p-6">
                  <CardHeader tag="h1">Players</CardHeader>
                  <CardBody>
                    { !!this.state.game && !!this.state.round ?
                    <CardBody>

                      <Table size="sm" hover responsive>
                        <thead>
                          <tr>
                            <th left>Player</th>
                            <th></th>
                            <th>Call</th>
                            <th>Card</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.state.game.players.map(player => 
                          <tr>
                            <td align="left">{player.displayName}</td>
                            <td>
                              {(this.state.round.currentPlayer.id === player.id)?<img src={"/cards/thumbnails/MY_TURN.png"} />:null}
                              {(this.state.me.id !== player.id && this.state.me.teamId === player.teamId)?<img src={"/cards/thumbnails/PARTNER.png"} />:null}
                              {(this.state.round.dealer.id === player.id)?<img src={"/cards/thumbnails/DEALER.png"} />:null}
                              {(!!this.state.round.goer && this.state.round.goer.id === player.id)?<img src={"/cards/thumbnails/GOER.png"} />:null}
                            </td>
                            <td>{player.call}</td>
                            <td>
                              {(!!this.state.round && !!this.state.round.currentHand) && !!this.state.round.currentHand[player.id] ?
                              <img src={"/cards/thumbnails/" + this.state.round.currentHand[player.id] + ".png"} class="thumbnail_size" /> : null}
                            </td>
                            <td>
                              {player.score}
                            </td>
                          </tr>
                        )}
                        </tbody>
                      </Table>

                    </CardBody>
                  : <div>No cards found....</div> }
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
