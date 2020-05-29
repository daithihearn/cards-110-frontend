import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import Snackbar from "@material-ui/core/Snackbar";
import { Container, Row, Col, Button, ButtonGroup, Form, Card, CardBody, CardGroup, Table } from 'reactstrap';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import uuid from 'uuid-random';
import shuffleAudio from '../../assets/sounds/shuffle.mp3';
import playCardAudio from '../../assets/sounds/play_card.mp3';
import alertAudio from '../../assets/sounds/alert.mp3';

const shuffleSound = new Audio(shuffleAudio);
const playCardSound = new Audio(playCardAudio);
const alertSound = new Audio(alertAudio);

function isCurrentPlayer(state) {
  return !!state.hand && state.hand.currentPlayerId === state.myId;
}

function isMyGo(state) {
  return (!!state.hand && state.hand.currentPlayerId === state.myId);
}

function iAmGoer(state) {
  return (!!state.round && state.round.goerId === state.myId);
}

function disableButtons() {
  return {actionsDisabled: true};
}

function enableButtons() {
  return {actionsDisabled: false};
}

class Game extends Component {
  constructor(props) {
    super(props);

    if (!props.location.state) {
      this.state = { myId: sessionStorage.getItem("myId"), selectedCards: [], actionsDisabled: false };
    } else {
      this.state = { myId: props.location.state.myId, selectedCards: [] };
      sessionStorage.setItem("myId", props.location.state.myId );
    }
    
    sessionUtils.checkLoggedIn();

    this.getGame();

    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  getGame() {
    let thisObj = this;

    gameService.getGame().then(response => {
      let state = thisObj.state;
      Object.assign(state, thisObj.updateGame(response.data, []));
      if (isCurrentPlayer(state)) {
        Object.assign(state, thisObj.setAlert());
      }
      thisObj.setState(state);
    }).catch(error => {
      thisObj.parseError(error);
    });
  }

  setAlert() {
    let thisObj = this;
    let stateDelta = { activeAlert: uuid() };
    this.sleep(10000).then(() => {
      if (!!thisObj.state.activeAlert && thisObj.state.activeAlert === stateDelta.activeAlert) {
        console.log("Hurry up!");
        alertSound.play();
        let stateUpdate = thisObj.state;
        Object.assign(stateUpdate, thisObj.cancelAlert());
        thisObj.setState(stateUpdate);
      }
    });

    return stateDelta;
  }

  cancelAlert() {
    if (!!this.state.activeAlert) {
      return {activeAlert: null};
    }
  }

  buttonsDisabled() {
    return this.state.actionsDisabled;
  }

  replay(event)  {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    thisObj.setState(state);
    
    gameService.replay().then(response => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.updateGame(response.data, [], `Successfully started a new game`));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate); 
    });
  };


  deal()  {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    thisObj.setState(state);

    gameService.deal().then(response => {
      shuffleSound.play();
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.updateGame(response.data, [], `Successfully dealt cards`));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate); 
    });
  };

  call(callAmount)  {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    thisObj.setState(state);

    gameService.call(callAmount).then(response => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.updateGame(response.data, [], `Successfully called ${callAmount}`));
      if (isCurrentPlayer(stateUpdate)) {
        Object.assign(stateUpdate, thisObj.setAlert());
      }
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate); 
    });
  };

  selectFromDummy(suit) {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, { selectedSuit: suit });
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());

    if (this.state.selectedSuit !== "HEARTS" && this.state.selectedSuit !== "DIAMONDS" && this.state.selectedSuit !== "CLUBS" && this.state.selectedSuit !== "SPADES") {
      Object.assign(state, thisObj.updateState({snackOpen: true, snackMessage: "Please select a suit!", snackType: "warning"}));
      Object.assign(state, enableButtons());
      thisObj.setState(state);  
      return;
    }

    thisObj.setState(state);

    let selectedCards = this.state.selectedCards;

    gameService.chooseFromDummy(selectedCards, this.state.selectedSuit).then(response => {
      shuffleSound.play();
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, { selectedSuit: null });
      Object.assign(stateUpdate, thisObj.updateGame(response.data, selectedCards, `Cards selected`));
      Object.assign(stateUpdate, enableButtons());

      if (stateUpdate.round.status === "BUYING" && iAmGoer(stateUpdate) && isMyGo(stateUpdate)) {
        thisObj.setState(stateUpdate);
        thisObj.sleep(500).then(() => thisObj.buyCards());
        return;
      }
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate); 
    });
  }

  buyCards(event) {
    if (!!event) {
      event.preventDefault();
    }
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    thisObj.setState(state);

    gameService.buyCards(state.selectedCards).then(response => {
      shuffleSound.play();
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.updateGame(response.data, [], `Bought cards`));
      if (isCurrentPlayer(stateUpdate)) {
        Object.assign(stateUpdate, thisObj.setAlert());
      }
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, thisObj.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate); 
    });
  }

  playCard() {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());

    let selectedCards = this.state.selectedCards;
    if (selectedCards.length !== 1) {
      Object.assign(state, thisObj.parseError({message: "Please select exactly one card to play"}));
      Object.assign(state, enableButtons());
      thisObj.setState(state);

    } else {
      
      let selectedCard = selectedCards[0];
      thisObj.setState(state);
      gameService.playCard(selectedCard).then(response => {
        playCardSound.play();
        let stateUpdate = thisObj.state;
        Object.assign(stateUpdate, thisObj.updateGame(response.data, [], `Played ${selectedCard}`));

        if (!!stateUpdate.round && stateUpdate.round.status === "CALLING" && stateUpdate.round.dealerId === stateUpdate.myId && stateUpdate.me.cards.length === 0) {
          Object.assign(state, enableButtons());
          thisObj.setState(stateUpdate);
          thisObj.sleep(500).then(() => thisObj.deal());
          return;
        }
        
        if (isCurrentPlayer(stateUpdate)) {
          Object.assign(stateUpdate, thisObj.setAlert());
        }

        Object.assign(stateUpdate, enableButtons());
        thisObj.setState(stateUpdate);
        
      }).catch(error => {
        let stateUpdate = thisObj.state;
        Object.assign(stateUpdate, thisObj.parseError(error));
        Object.assign(stateUpdate, enableButtons());
        thisObj.setState(stateUpdate); 
      });
    }
  }

  handleSelectCard(card) {
    if (!this.state.cardsSelectable) {
      return
    }
    let state = this.state;
    Object.assign(state, this.cancelAlert());

    let selectedCards = state.selectedCards;
    let indexOfCard = selectedCards.indexOf(card);
    if (indexOfCard !== -1) {
      selectedCards.splice(indexOfCard, 1);
    } else {
      selectedCards.push(card);
    }

    Object.assign(state, {selectedCards: selectedCards});
    this.setState(state);
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
      return;
    }
    let thisObj = this;
    let state = this.state;

    switch (content.type) {
      case("REPLAY"):
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards, "Game restarting"));
        break;
      case("DEAL"):
        shuffleSound.play();
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards, "Cards dealt"));
        if (isCurrentPlayer(state)) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("GAME_OVER"):
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards, "Game Over"));
        break;
      case("LAST_CARD_PLAYED"):
        playCardSound.play();
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards));
        break;
      case("CARD_PLAYED"):
        playCardSound.play();
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards));
        
        if (isMyGo(state) && state.me.cards.length === 1) {
          Object.assign(state, {selectedCards: state.me.cards});
          Object.assign(state, enableButtons());
          thisObj.setState(state);
          thisObj.sleep(500).then(() => thisObj.playCard());
          return;
        }
        
        if (isCurrentPlayer(state)) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("BUY_CARDS"):
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards, content.content.second));

        if (state.round.status === "BUYING" && iAmGoer(state) && isMyGo(state)) {
          thisObj.setState(state);
          thisObj.sleep(500).then(() => thisObj.buyCards());
          return;
        }
        
        if (isCurrentPlayer(state)) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("HAND_COMPLETED"):
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards));
        
        if (isMyGo(state) && state.me.cards.length === 1) {
          Object.assign(state, {selectedCards: state.me.cards});
          Object.assign(state, enableButtons());
          thisObj.setState(state);
          thisObj.sleep(500).then(() => thisObj.playCard());
          return;
        }
        
        if (isCurrentPlayer(state)) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("ROUND_COMPLETED"):
        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards));
        
        if (!!state.round && state.round.status === "CALLING" && state.round.dealerId === state.myId && state.me.cards.length === 0) {
          Object.assign(state, enableButtons());
          thisObj.setState(state);
          thisObj.sleep(500).then(() => thisObj.deal());
          return;
        }

        break;
      case("CALL"):
      case("CHOOSE_FROM_DUMMY"):

        Object.assign(state, thisObj.updateGame(content.content.first, state.selectedCards));
        if (isCurrentPlayer(state)) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      default:
        Object.assign(state, thisObj.parseError({message: "Unsupported content type"}));
    }

    thisObj.setState(state);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateGame(game, selectedCard, message) {
    let me = game.players.filter(player => player.id === this.state.myId)[0];
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

    let maxCall = this.getMaxCall(game.players);
    let stateDelta = {game: game, round: round, hand: hand, previousHand: previousHand, me: me, dummy: dummy, maxCall: maxCall, selectedCards: selectedCard, cardsSelectable: cardsSelectable }
    if (!!message) {
      stateDelta.snackOpen = true;
      stateDelta.snackMessage = message;
      stateDelta.snackType = "success";
    }
    return stateDelta;
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
    return { snackOpen: true, snackMessage: errorMessage, snackType: "error" };
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
                                    

                        <CardBody className="cardArea">
                          <Container>
                            <Row>
                          {this.state.game.players.map( player =>
                              <Col>
                                <div>
                                  {player.displayName}
                                </div>
                             

                                <div>
                               
                              
                                  <img alt={player.displayName} src={(!!this.state.hand.playedCards[player.id] )? "/cards/thumbnails/" + this.state.hand.playedCards[player.id] + ".png" : 
                                   [(this.state.hand.currentPlayerId !== player.id)
                                    ?
                                  "/cards/thumbnails/blank_grey_back.png"
                                :   "/cards/thumbnails/yellow_back_blank.png"] } 
                                  
                                  class={(!!this.state.hand.playedCards[player.id] )? "thumbnail_size" : 
                                  [(this.state.hand.currentPlayerId !== player.id)
                                    ? "thumbnail_size  transparent " : "thumbnail_size"]
                                        } />
                                      </div>
                                <div>
                               
                              {(this.state.me.id !== player.id && this.state.me.teamId === player.teamId)?<img alt="Partner Chip" src={"/cards/thumbnails/PARTNER.png"} />:null}
                              {((this.state.round.dealerId === player.id) && (!this.state.round.goerId)) ? <img alt="Dealer Chip" src={"/cards/thumbnails/DEALER.png"} />:null}
                              {(player.call===10) ? <img alt="Ten Chip" src={"/cards/originals/call_10.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===15) ? <img alt="15 Chip" src={"/cards/originals/call_15.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===20) ? <img alt="20 Chip" src={"/cards/originals/call_20.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===25) ? <img alt="25 Chip" src={"/cards/originals/call_25.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===30) ? <img alt="Jink Chip" src={"/cards/originals/call_jink.png"} class= "thumbnail_size_extra_small"/> : null}

                                </div>
                              </Col>
                          )}
                            </Row>
                          </Container>
                        </CardBody>


                      { !!this.state.me.cards && this.state.me.cards.length > 0 ?
                        <CardBody className="cardArea">
                          { this.state.me.cards.map(card => 
                            <img alt={card} onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(!this.state.cardsSelectable || this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                          )}
                        </CardBody>
                      : null}
                      
                      { this.state.me.id !== this.state.round.dealerId && this.state.me.cards.length === 0 ?
                      <CardBody className="cardArea">
                        <h2 >Waiting for dealer.</h2>
                      </CardBody>
                      : null}
                

                      {/* Calling  */}

                      { !!this.state.round && this.state.round.status === "CALLING" ?
                      <div>
                        <CardBody className="buttonArea">
                        
                            {(!!this.state.hand && this.state.me.cards.length > 0 && this.state.hand.currentPlayerId === this.state.myId) ?

                            <ButtonGroup size="lg">
                              <Button type="button" color="secondary" disabled={this.state.actionsDisabled} onClick={this.call.bind(this, 0)}>Pass</Button>
                              { (this.state.game.players.length === 6 && ((this.state.me.id === this.state.round.dealerId && this.state.maxCall <= 10) || this.state.maxCall < 10)) ? <Button type="button" color="primary" onClick={this.call.bind(this, 10)}>Call 10</Button> : null }
                              { (this.state.me.id === this.state.round.dealerId && this.state.maxCall <= 15) || this.state.maxCall < 15 ? <Button type="button" disabled={this.state.actionsDisabled} color="primary" onClick={this.call.bind(this, 15)}>Call 15</Button> : null }
                              { (this.state.me.id === this.state.round.dealerId && this.state.maxCall <= 20) || this.state.maxCall < 20 ? <Button type="button" disabled={this.state.actionsDisabled} color="primary" onClick={this.call.bind(this, 20)}>Call 20</Button> : null }
                              { (this.state.me.id === this.state.round.dealerId && this.state.maxCall <= 25) || this.state.maxCall < 25 ? <Button type="button" disabled={this.state.actionsDisabled} color="primary" onClick={this.call.bind(this, 25)}>Call 25</Button> : null }
                              <Button type="button" disabled={this.state.actionsDisabled} color="danger" onClick={this.call.bind(this, 30)}>Jink</Button>
                            </ButtonGroup>

                            : null}
                            
                        </CardBody>
                        { this.state.me.id === this.state.round.dealerId && this.state.me.cards.length === 0 ?
                        <CardBody className="cardArea">
                          <img alt="Deck" onClick={this.deal.bind(this)} src={"/cards/thumbnails/yellow_back_deal.png"} class="thumbnail_size" />
                        </CardBody>
                        : null }
                      </div>
                      : null}

                      {/* Called  */}

                      { !!this.state.round && this.state.round.status === "CALLED" ?
                      <div>

                        {iAmGoer(this.state) ? 
                          <div>
                            {!!this.state.dummy ?
                            <CardBody className="cardArea">

                              { this.state.dummy.cards.map(card => 
                                <img alt={card} onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                              )}

                            </CardBody>
                            : null }
                            

                            <CardBody className="buttonArea">
                                <legend>Suit</legend>

                                <ButtonGroup size="lg">

                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'HEARTS') ? "success":"secondary"} onClick={this.selectFromDummy.bind(this, "HEARTS")}>HEARTS</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'DIAMONDS') ? "success":"secondary"} onClick={this.selectFromDummy.bind(this, "DIAMONDS")}>DIAMONDS</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'SPADES') ? "success":"secondary"} onClick={this.selectFromDummy.bind(this, "SPADES")}>SPADES</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'CLUBS') ? "success":"secondary"} onClick={this.selectFromDummy.bind(this, "CLUBS")}>CLUBS</Button>

                                </ButtonGroup>
                                
                            </CardBody>
                          </div>

                        : <CardBody><h2>Waiting for the goer to select from the dummy</h2></CardBody>}
                          
                      </div>
                      : null}

                      {/* BUYING  */}

                      { !!this.state.round && this.state.round.status === "BUYING" ?
                      <CardBody className="buttonArea">

                        <Form onSubmit={this.buyCards.bind(this)}>
                          <ButtonGroup size="lg">
                            {isMyGo(this.state) ? <Button type="submit" disabled={this.state.actionsDisabled} color="primary">Buy Cards</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}

                      {/* PLAYING  */}

                      { !!this.state.round && this.state.round.status === "PLAYING" ?
                      <CardBody className="buttonArea">

                          <ButtonGroup size="lg">
                            {isMyGo(this.state) ? <Button id="playCardButton" type="button" disabled={this.state.actionsDisabled} onClick={this.playCard.bind(this)} color="primary">Play Card</Button> : null }
                          </ButtonGroup>
                          
                      </CardBody>
                      : null}

                    { !!this.state.round.suit ?  <div>
                        {(this.state.round.suit === "CLUBS")?<img alt="Clubs" src={"/cards/originals/clubs.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "DIAMONDS")?<img alt="Diamonds" src={"/cards/originals/diamonds.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "SPADES")?<img alt="Spades" src={"/cards/originals/spades.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "HEARTS")?<img alt="Hearts" src={"/cards/originals/hearts.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                             </div>
                             :null}

                    </div>


                  : null }

                  

                  {/* FINISHED  */}

                  { !!this.state.me && !!this.state.game && this.state.round && this.state.game.status === "FINISHED" ?
                      <CardBody className="buttonArea">
                        
                        { this.state.me.id === this.state.round.dealerId ?
                        <ButtonGroup size="lg">
                          <Button type="button" color="primary" disabled={this.state.actionsDisabled} onClick={this.replay.bind(this)}>Start a new game</Button>
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
                            <th align="left">Player</th>
                            <th>Previous</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.state.game.players.map(player => 
                          <tr>
                            <td align="left">{player.displayName}</td>
                            <td>
                              {!!this.state.previousHand && !!this.state.previousHand.playedCards[player.id] ?
                              <img alt={this.state.previousHand.playedCards[player.id]} src={"/cards/thumbnails/" + this.state.previousHand.playedCards[player.id] + ".png"} class="thumbnail_size_small cardNotSelected"  /> : null }
                            </td>
                            <td>
                              {player.score}
                            </td>
                          </tr>
                        )}
                        </tbody>
                      </Table>

                    </CardBody>
                  : null }
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
