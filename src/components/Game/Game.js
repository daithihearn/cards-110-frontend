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

    this.getGame();

    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleSuitChange = this.handleSuitChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  getGame() {
    let thisObj = this;

    gameService.getGame().then(response => {
      thisObj.updateGame(thisObj, response.data, []);
    }).catch(error => {
      thisObj.parseError(error);
    });
  }

  replay(event)  {
    let thisObj = this;
    gameService.replay().then(response => {
      thisObj.updateGame(thisObj, response.data, [], `Successfully started a new game`);
    }).catch(error => thisObj.parseError(error));
  };


  deal(event)  {
    let thisObj = this;
    gameService.deal().then(response => {
      thisObj.updateGame(thisObj, response.data, [], `Successfully dealt cards`);
    }).catch(error => thisObj.parseError(error));
  };

  call(callAmount, event)  {
    let thisObj = this;
    gameService.call(callAmount).then(response => {
      thisObj.updateGame(thisObj, response.data, [], `Successfully called ${callAmount}`);
    }).catch(error => thisObj.parseError(error));
  };

  selectFromDummy(event) {
    event.preventDefault();
    let thisObj = this;

    if (this.state.selectedSuit !== "HEARTS" && this.state.selectedSuit !== "DIAMONDS" && this.state.selectedSuit !== "CLUBS" && this.state.selectedSuit !== "SPADES") {
      this.updateState({snackOpen: true, snackMessage: "Please select a suit!", snackType: "warning"})
      return;
    }

    let selectedCards = this.state.selectedCards;

    gameService.chooseFromDummy(selectedCards, this.state.selectedSuit).then(response => {
      thisObj.updateState({ selectedSuit: null });
      thisObj.updateGame(thisObj, response.data, selectedCards, `Cards selected`);
    }).catch(error => thisObj.parseError(error));
  }

  buyCards(event) {
    event.preventDefault();
    let thisObj = this;

    gameService.buyCards(this.state.selectedCards).then(response => {
      thisObj.updateGame(thisObj, response.data, [], `Bought cards`);
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
        thisObj.updateGame(thisObj, response.data, [], `Played ${selectedCard}`);
      }).catch(error => thisObj.parseError(error));
    }
  }

  handleSelectCard(card) {
    if (!this.state.cardsSelectable) {
      return
    }
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

  handleSuitChange(suit) {
    this.updateState({
      selectedSuit: suit
    });
  }

  parseScreenContent(content) {
    if (!content) {
      return
    }

    if(content.type === "GAME") {
      this.updateGame(this, content.content, this.state.selectedCards);
    } else if(content.type === "LEADERBOARD") {
      this.updateState({leaderboard: content.content});
    } else {
      this.parseError({message: "Unsupported content type"})
    }
  }

  updateGame(thisObj, game, selectedCard, message) {
    let me = game.players.filter(player => player.id === thisObj.state.myId)[0];
    let dummy = game.players.filter(player => player.id === "dummy")[0];
    let round = game.currentRound;
    let hand = round.currentHand;
    
    
    let previousHand = null;
    
    if (round.completedHands.length > 0) {
      previousHand = round.completedHands[round.completedHands.length - 1];
    }

    const index = game.players.indexOf(dummy);
    if (index > -1) {
      game.players.splice(index, 1);
    }

    let cardsSelectable = (["CALLED", "BUYING", "PLAYING"].includes(round.status)); 

    let maxCall = thisObj.getMaxCall(game.players);
    let newState = {game: game, round: round, hand: hand, previousHand: previousHand, me: me, dummy: dummy, maxCall: maxCall, selectedCards: selectedCard, cardsSelectable: cardsSelectable }
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
      <div className="app carpet">
         <div className="game_wrap">
          <div className="game_container">

            <CardGroup>
              <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>

                  { !!this.state.me && !!this.state.round && !!this.state.hand && this.state.game.status !== "FINISHED" ?
                    <div>

                      <CardBody>{(this.state.hand.currentPlayerId === this.state.myId)?<img src={"/cards/thumbnails/MY_TURN.png"} />:null}
                              {(this.state.round.dealerId === this.state.myId)?<img src={"/cards/thumbnails/DEALER.png"} />:null}
                              {(this.state.round.goerId === this.state.myId)?<img src={"/cards/thumbnails/GOER.png"} />:null}</CardBody>

                      { !!this.state.round.suit ? 
                        <CardBody><h2>Trumps: {this.state.round.suit}</h2></CardBody>
                      : null}

                      { !!this.state.me.cards && this.state.me.cards.length > 0 ?
                        <CardBody>
                          { this.state.me.cards.map(card => 
                            <img onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(!this.state.cardsSelectable || this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                          )}
                        </CardBody>
                      : null}
                      
                      { this.state.me.id !== this.state.round.dealerId && this.state.me.cards.length === 0 ?
                      <CardBody>
                        <h2 >Waiting for dealer.</h2>
                      </CardBody>
                      : null}
                

                      {/* Calling  */}

                      { !!this.state.round && this.state.round.status === "CALLING" ?
                      <div>
                        <CardBody>

                            {(!!this.state.hand && this.state.me.cards.length > 0 && this.state.hand.currentPlayerId === this.state.myId) ?

                            <ButtonGroup size="lg">
                              <Button type="button" color="secondary" onClick={this.call.bind(this, 0)}>Pass</Button>
                              { (this.state.me.id == this.state.round.dealerId && this.state.maxCall <= 10) || this.state.maxCall < 10 ? <Button type="button" color="primary" onClick={this.call.bind(this, 10)}>Call 10</Button> : null }
                              { (this.state.me.id == this.state.round.dealerId && this.state.maxCall <= 15) || this.state.maxCall < 15 ? <Button type="button" color="primary" onClick={this.call.bind(this, 15)}>Call 15</Button> : null }
                              { (this.state.me.id == this.state.round.dealerId && this.state.maxCall <= 20) || this.state.maxCall < 20 ? <Button type="button" color="primary" onClick={this.call.bind(this, 20)}>Call 20</Button> : null }
                              { (this.state.me.id == this.state.round.dealerId && this.state.maxCall <= 25) || this.state.maxCall < 25 ? <Button type="button" color="primary" onClick={this.call.bind(this, 25)}>Call 25</Button> : null }
                              <Button type="button" color="danger" onClick={this.call.bind(this, 30)}>Jink</Button>
                            </ButtonGroup>

                            : null}
                            
                        </CardBody>
                        { this.state.me.id == this.state.round.dealerId && this.state.me.cards.length == 0 ?
                        <CardBody>
                          <img onClick={this.deal.bind(this)} src={"/cards/thumbnails/green_back.png"} />
                        </CardBody>
                        : null }
                      </div>
                      : null}

                      {/* Called  */}

                      { !!this.state.round && this.state.round.status === "CALLED" ?
                      <div>

                        {this.state.round.goerId === this.state.myId ? 
                          <div>
                            { this.state.round.status === "CALLED" && !!this.state.dummy ?
                            <CardBody>

                              { this.state.dummy.cards.map(card => 
                                <img onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                              )}

                            </CardBody>
                            : null }
                            <CardBody>
                              <Form onSubmit={this.selectFromDummy.bind(this)}>
                                <legend>Suit</legend>

                                <ButtonGroup size="lg">

                                  <Button type="button" color={(this.state.selectedSuit === 'HEARTS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "HEARTS")}>HEARTS</Button>
                                  <Button type="button" color={(this.state.selectedSuit === 'DIAMONDS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "DIAMONDS")}>DIAMONDS</Button>
                                  <Button type="button" color={(this.state.selectedSuit === 'SPADES') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "SPADES")}>SPADES</Button>
                                  <Button type="button" color={(this.state.selectedSuit === 'CLUBS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "CLUBS")}>CLUBS</Button>

                                </ButtonGroup>
                                <br/><br/>
                                <ButtonGroup size="lg">
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
                          <ButtonGroup size="lg">
                            {(!!this.state.hand && this.state.hand.currentPlayerId === this.state.myId) ? <Button type="submit" color="primary">Buy Cards</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}

                      {/* PLAYING  */}

                      { !!this.state.round && this.state.round.status === "PLAYING" ?
                      <CardBody>

                        <Form onSubmit={this.playCard.bind(this)}>
                          <ButtonGroup size="lg">
                            {(!!this.state.hand && this.state.hand.currentPlayerId === this.state.myId) ? <Button type="submit" color="primary">Play Card</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}


                    </div>


                  : <div>No cards found....</div> }

                  {/* FINISHED  */}

                  { !!this.state.me && !!this.state.game && this.state.round && this.state.game.status === "FINISHED" ?
                      <CardBody>
                        
                        { this.state.me.id === this.state.round.dealerId ?
                        <ButtonGroup size="lg">
                          <Button type="button" color="primary" onClick={this.replay.bind(this)}>Start a new game</Button>
                        </ButtonGroup>
                        : <h2>Game Over - The dealer can start a new game</h2>}
                        
                      </CardBody>
                  : null}
                
                  <CardBody>
                    { !!this.state.game && !!this.state.hand ?
                    <CardBody>

                      <Table dark responsive>
                        <thead>
                          <tr>
                            <th left>Player</th>
                            <th></th>
                            <th>Call</th>
                            <th>Previous</th>
                            <th>Current</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.state.game.players.map(player => 
                          <tr>
                            <td align="left">{player.displayName}</td>
                            <td>
                              {(this.state.hand.currentPlayerId === player.id)?<img src={"/cards/thumbnails/MY_TURN.png"} />:null}
                              {(this.state.me.id !== player.id && this.state.me.teamId === player.teamId)?<img src={"/cards/thumbnails/PARTNER.png"} />:null}
                              {(this.state.round.dealerId === player.id)?<img src={"/cards/thumbnails/DEALER.png"} />:null}
                              {(this.state.round.goerId === player.id)?<img src={"/cards/thumbnails/GOER.png"} />:null}
                            </td>
                            <td>{player.call}</td>
                            <td>
                              {!!this.state.previousHand && !!this.state.previousHand.playedCards[player.id] ?
                              <img src={"/cards/thumbnails/" + this.state.previousHand.playedCards[player.id] + ".png"} class="thumbnail_size cardNotSelected" /> : null }
                            </td>
                            <td>
                              {!!this.state.hand.playedCards[player.id] ?
                              <img src={"/cards/thumbnails/" + this.state.hand.playedCards[player.id] + ".png"} class="thumbnail_size" /> : null }
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
