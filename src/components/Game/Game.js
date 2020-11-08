import React, { Component } from 'react';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import { Button, ButtonGroup, Form, Row, Col, Card, CardImgOverlay, CardText, CardImg, CardBody, CardGroup, Container, Table, CardHeader } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import DefaultHeader from '../Header';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import uuid from 'uuid-random';
import shuffleAudio from '../../assets/sounds/shuffle.ogg';
import playCardAudio from '../../assets/sounds/play_card.ogg';
import alertAudio from '../../assets/sounds/alert.ogg';
// import NoSleep from 'nosleep.js';
import errorUtils from '../../utils/ErrorUtils';

import auth0Client from '../../Auth';

// const noSleep = new NoSleep();

const compareScore = (a, b) => {
  let comparison = 0;
  if (b.score > a.score) {
    comparison = 1;
  } else if (b.score < a.score) {
    comparison = -1;
  }
  return comparison;
}

const compareSeat = (a, b) => {
  let comparison = 0;
  if (a.seatNumber > b.seatNumber) {
    comparison = 1;
  } else if (a.seatNumber < b.seatNumber) {
    comparison = -1;
  }
  return comparison;
}
const shuffleSound = new Audio(shuffleAudio);
const playCardSound = new Audio(playCardAudio);
const alertSound = new Audio(alertAudio);

function isThereGo(game, playerId) {
  return !!game.round.currentHand && game.round.currentHand.currentPlayerId === playerId;
}

function isGoer(game, playerId) {
  return (!!game.round && game.round.goerId === playerId);
}

function isDealer(game, playerId) {
  return (!!game.round && game.round.dealerId === playerId);
}

function disableButtons() {
  return {actionsDisabled: true};
}

function enableButtons() {
  return {actionsDisabled: false};
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Game extends Component {
  constructor(props) {
    super(props);
    
    if (!props.location.state || !props.location.state.gameId) {
      this.updateState(errorUtils.parseError({message: "No Game provided"}));
      return;
    }

    this.state = { isMyGo: false, iAmGoer: false, iAmDealer: false, 
      gameId: props.location.state.gameId, selectedCards: [], actionsDisabled: false };

    this.goHome = this.goHome.bind(this);
    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }
  
  async componentDidMount() {
    
    try {
      let state = this.state;
      // Get Game
      let gameRes = await gameService.getGameForPlayer(state.gameId);
      Object.assign(state, { game: gameRes.data });

      // Get Players
      let players = await gameService.getPlayersForGame(state.gameId);
      state.players = players.data;

      let oidcProfile = auth0Client.getProfile();
      let profile = state.players.filter(player => player.subject === oidcProfile.sub)[0];
      state.profile = profile;

      Object.assign(state, this.updateGame(state.game));
      if (state.isMyGo) {
        Object.assign(state, this.setAlert());
      }
      this.setState(state);
    }
    catch(error) {
      let stateUpdate = this.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
      this.setState(stateUpdate); 
    }
  }
  
  getPlayersForGame(gameId) {
    let thisObj = this;
    gameService.getPlayersForGame(gameId).then(response => {
      thisObj.updateState({players: response.data})
    }).catch(error => {
      let stateUpdate = this.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
      this.setState(stateUpdate); 
    });
  }


  setAlert() {
    let thisObj = this;
    let stateDelta = { activeAlert: uuid() };
    sleep(10000).then(() => {
      if (!!thisObj.state.activeAlert && thisObj.state.activeAlert === stateDelta.activeAlert) {
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

  goHome() {
    this.props.history.push({
      pathname: '/'
    });
  }

  deal()  {
    if (this.buttonsDisabled()) {
      return;
    }
    let thisObj = this;
    let state = this.state;
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    thisObj.setState(state);

    gameService.deal(this.state.gameId).then(response => {
      shuffleSound.play();
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, enableButtons());
      thisObj.setState(stateUpdate);

    }).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
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

    gameService.call(this.state.gameId, callAmount).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
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
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());

    if (suit !== "HEARTS" && suit !== "DIAMONDS" && suit !== "CLUBS" && suit !== "SPADES") {
      Object.assign(state, thisObj.updateState({snackOpen: true, snackMessage: "Please select a suit!", snackType: "warning"}));
      Object.assign(state, enableButtons());
      thisObj.setState(state);  
      return;
    }

    thisObj.setState(state);

    gameService.chooseFromDummy(this.state.gameId, this.state.selectedCards, suit).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
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

    gameService.buyCards(this.state.gameId, state.selectedCards).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
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
      Object.assign(state, errorUtils.parseError({message: "Please select exactly one card to play"}));
      Object.assign(state, enableButtons());
      thisObj.setState(state);

    } else {
      
      let selectedCard = selectedCards[0];
      thisObj.setState(state);
      gameService.playCard(this.state.gameId, selectedCard).catch(error => {
        let stateUpdate = thisObj.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
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

    // If the round status is PLAYING then only allow one card to be selected
    if (this.state.game.round.status === "PLAYING") {
      if (indexOfCard === -1) {
        selectedCards = [card];
      } else {
        selectedCards = [];
      }
    } 
    else {
      if (indexOfCard === -1) {
        selectedCards.push(card);
      } else {
        selectedCards.splice(indexOfCard, 1);
      }
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
        Object.assign(state, thisObj.updateGame(content.content));
        break;
      case("DEAL"):
        shuffleSound.play();
        Object.assign(state, thisObj.updateGame(content.content));
        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("GAME_OVER"):
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content));
        Object.assign(state, enableButtons());
        break;
      case("LAST_CARD_PLAYED"):
        playCardSound.play();
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content));
        break;
      case("CARD_PLAYED"):
        playCardSound.play();
        Object.assign(state, thisObj.updateGame(content.content));

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
        }
        
        if (state.isMyGo && state.game.cards.length === 1) {
          Object.assign(state, {selectedCards: state.game.cards});
          thisObj.setState(state);
          sleep(500).then(() => thisObj.playCard());
          return;
        }
        
        if (state.isMyGo) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("BUY_CARDS"):
        Object.assign(state, thisObj.updateGame(content.content));

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }

        if (state.game.round.status === "BUYING" && state.iAmGoer && state.isMyGo) {
          Object.assign(state, { selectedCards: state.game.cards });
          thisObj.setState(state);
          sleep(500).then(() => thisObj.buyCards());
          return;
        }
        
        break;
      case("BUY_CARDS_NOTIFICATION"):
        let player = this.state.players.find(player => player.id === content.content.playerId);
        Object.assign(state, {snackOpen: true, snackMessage: `${player.name} bought ${content.content.bought}`, snackType: "info"});
        break;
      case("HAND_COMPLETED"):
        Object.assign(state, thisObj.updateGame(content.content));

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
        }

        if (state.isMyGo && state.game.cards.length === 1) {
          Object.assign(state, {selectedCards: state.game.cards});
          thisObj.setState(state);
          sleep(500).then(() => thisObj.playCard());
          return;
        }
        
        if (state.isMyGo) {
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("ROUND_COMPLETED"):
        Object.assign(state, thisObj.updateGame(content.content));

        if (state.iAmDealer) {
          Object.assign(state, enableButtons());
        }

        if (!!state.game.round && state.game.round.status === "CALLING" && state.iAmDealer) {
          thisObj.setState(state);
          sleep(500).then(() => thisObj.deal());
          return;
        }

        break;
      case("CALL"):
        Object.assign(state, thisObj.updateGame(content.content));
        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("CHOOSE_FROM_DUMMY"):

        Object.assign(state, thisObj.updateGame(content.content));
        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }

        if (state.game.round.status === "BUYING" && state.iAmGoer && state.isMyGo) {
          Object.assign(state, { selectedCards: state.game.cards });
          thisObj.setState(state);
          sleep(500).then(() => thisObj.buyCards());
          return;
        }
        break;
      default:
        Object.assign(state, errorUtils.parseError({message: "Unsupported content type"}));
    }

    thisObj.setState(state);
  }

  updateGame(game) {
    let previousHand = null;
    
    if (!!game.round && game.round.completedHands.length > 0) {
      previousHand = game.round.completedHands[game.round.completedHands.length - 1];
    }

    let cardsSelectable = (["CALLED", "BUYING", "PLAYING"].includes(game.round.status));

    return { game: game, selectedCards: [], previousHand: previousHand, cardsSelectable: cardsSelectable, 
      isMyGo: isThereGo(game, this.state.profile.id),
      iAmGoer: isGoer(game, this.state.profile.id),
      iAmDealer: isDealer(game, this.state.profile.id)};
  }

  handleChange(event) {
    let key = event.target.getAttribute("name");
    let updateObj = { [key]: event.target.value };
    this.updateState(updateObj);
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

            <CardGroup>
              <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>

              { !!this.state.game && !!this.state.game.me && !!this.state.game.round && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players && this.state.game.status !== "FINISHED" ?
                    <div>

                        { !!this.state.game.round.suit ?
                        <CardHeader className="cardAreaHeaderContainer">
                          
                          <h2 className="cardAreaHeader">
                            {this.state.players.filter(player => player.id === this.state.game.round.goerId)[0].name.split(" ")[0].substring(0, 6)}
                            
                            <CardImg alt="Chip" src={`/cards/originals/call_${this.state.game.playerProfiles.filter(profile => profile.id === this.state.game.round.goerId)[0].call}.png`} className= "thumbnail_size_extra_small left-padding"/>
                            
                            <CardImg alt="Suit" src={`/cards/originals/${this.state.game.round.suit}_ICON.svg`}  className="thumbnail_size_extra_small left-padding" />
                          </h2>
                          
                          
                        </CardHeader>
                        : " "}
                        <CardBody className="cardArea">
                          <Container>
                            <Row>
                          {this.state.game.playerProfiles.sort(compareSeat).map((playerProfile, idx) =>
                              <Col key={`cards_${idx}`} className="player-column">
                                <div>
                                  <CardImg alt={this.state.players.find(p => p.id === playerProfile.id).name} src={this.state.players.find(q => q.id === playerProfile.id).picture} className="avatar" />
                                  <CardImgOverlay>
                                    <CardText className="overlay-score">{playerProfile.score}</CardText>
                                  </CardImgOverlay>
                                </div>
                             

                                <div>
                               
                                  {(!!this.state.game.round.currentHand.playedCards[playerProfile.id] ) ?

                                      <CardImg alt={playerProfile.displayName} src={`/cards/thumbnails/${this.state.game.round.currentHand.playedCards[playerProfile.id]}.png`} className="thumbnail_size" />

                                  : 
                                      <a>
                                        <CardImg alt={playerProfile.displayName} 
                                          src={`/cards/thumbnails/${(this.state.game.round.currentHand.currentPlayerId === playerProfile.id) ? "yellow":"blank_grey"}_back.png`} 
                                          className={`thumbnail_size ${(this.state.game.round.currentHand.currentPlayerId === playerProfile.id) ? "":"transparent"}`} />
                                        
                                        { !this.state.game.round.suit && isDealer(this.state.game, playerProfile.id) ?
                                        <CardImgOverlay>
                                          <CardImg alt="Dealer Chip" src={"/cards/originals/DEALER.png"} className= "thumbnail_chips overlay_dealer_chip"/>
                                        </CardImgOverlay>
                                        : null}

                                        { !this.state.game.round.suit ?  
                                          <CardImgOverlay>
                                            {(playerProfile.call===10) ? <CardImg alt="Ten Chip" src={"/cards/originals/call_10.png"} className= "thumbnail_chips overlay-chip"/> : null}
                                            {(playerProfile.call===15) ? <CardImg alt="15 Chip" src={"/cards/originals/call_15.png"} className= "thumbnail_chips overlay-chip"/> : null}
                                            {(playerProfile.call===20) ? <CardImg alt="20 Chip" src={"/cards/originals/call_20.png"} className= "thumbnail_chips overlay-chip"/> : null}
                                            {(playerProfile.call===25) ? <CardImg alt="25 Chip" src={"/cards/originals/call_25.png"} className= "thumbnail_chips overlay-chip"/> : null}
                                            {(playerProfile.call===30) ? <CardImg alt="Jink Chip" src={"/cards/originals/call_jink.png"} className= "thumbnail_chips overlay-chip"/> : null}
                                          </CardImgOverlay>
                                          :null}
                                      
                                      </a>
                                  }
                                  </div>                               
                               
                                <div>
                              

                                </div>
                              </Col>
                          )}
                            </Row>
                          </Container>
                        </CardBody>


                      { !!this.state.game.me && !!this.state.game.cards && this.state.game.cards.length > 0 ?
                        <CardBody className="cardArea">
                          { this.state.game.cards.map(card => 
                            <CardImg alt={card} onClick={this.handleSelectCard.bind(this, card)} 
                              src={"/cards/thumbnails/" + card + ".png"} className={(!this.state.cardsSelectable || this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                          )}
                        </CardBody>
                      : null}
                      
                      { this.state.game.me.id !== this.state.game.round.dealerId && this.state.game.cards.length === 0 ?
                      <CardBody className="cardArea">
                        <h2 >Waiting for dealer.</h2>
                      </CardBody>
                      : null}
                

                      {/* Calling  */}

                      { !!this.state.game.round && this.state.game.round.status === "CALLING" ?
                      <div>
                        { this.state.iAmDealer && this.state.game.cards.length === 0 ?
                          <CardBody className="cardArea">
                            <img alt="Deck" onClick={this.deal.bind(this)} src={"/cards/thumbnails/yellow_back_deal.png"} className="thumbnail_size" />
                          </CardBody>
                        : null }
                        <CardBody className="buttonArea">
                        
                            {(!!this.state.game.round.currentHand && this.state.game.cards.length > 0 && this.state.game.round.currentHand.currentPlayerId === this.state.profile.id) ?

                            <ButtonGroup size="lg">
                              <Button type="button" color="secondary" disabled={this.state.actionsDisabled} onClick={this.call.bind(this, 0)}>Pass</Button>
                              { (this.state.game.playerProfiles.length === 6 && ((this.state.game.me.id === this.state.game.round.dealerId && this.state.game.maxCall <= 10) || this.state.game.maxCall < 10)) ? <Button type="button" color="primary" onClick={this.call.bind(this, 10)}>10</Button> : null }
                              { (this.state.game.me.id === this.state.game.round.dealerId && this.state.game.maxCall <= 15) || this.state.game.maxCall < 15 ? <Button type="button" disabled={this.state.actionsDisabled} color="warning" onClick={this.call.bind(this, 15)}>15</Button> : null }
                              { (this.state.game.me.id === this.state.game.round.dealerId && this.state.game.maxCall <= 20) || this.state.game.maxCall < 20 ? <Button type="button" disabled={this.state.actionsDisabled} color="warning" onClick={this.call.bind(this, 20)}>20</Button> : null }
                              { (this.state.game.me.id === this.state.game.round.dealerId && this.state.game.maxCall <= 25) || this.state.game.maxCall < 25 ? <Button type="button" disabled={this.state.actionsDisabled} color="warning" onClick={this.call.bind(this, 25)}>25</Button> : null }
                              <Button type="button" disabled={this.state.actionsDisabled} color="danger" onClick={this.call.bind(this, 30)}>Jink</Button>
                            </ButtonGroup>

                            : null}
                            
                        </CardBody>
                      </div>
                      : null}

                      {/* Called  */}

                      { !!this.state.game.round && this.state.game.round.status === "CALLED" ?
                      <div>

                        {this.state.iAmGoer ? 
                          <div>
                            {!!this.state.game.dummy ?
                            <CardBody className="cardArea">

                              { this.state.game.dummy.map(card => 
                                <img alt={card} onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} className={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                              )}

                      
                            </CardBody>
                            : null }
                            

                            <CardBody className="buttonArea">
                                {/* <legend>Suit</legend> */}

                                <ButtonGroup size="lg">

                                  <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "HEARTS")}><img alt="Hearts" src={"/cards/originals/HEARTS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "DIAMONDS")}><img alt="Hearts" src={"/cards/originals/DIAMONDS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "SPADES")}><img alt="Hearts" src={"/cards/originals/SPADES_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "CLUBS")}><img alt="Hearts" src={"/cards/originals/CLUBS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>

                                </ButtonGroup>
                                
                            </CardBody>
                          </div>

                        : <CardBody><h2>Waiting for the goer to select from the dummy</h2></CardBody>}
                          
                      </div>
                      : null}

                      {/* BUYING  */}

                      { !!this.state.game.round && this.state.game.round.status === "BUYING" ?
                      <CardBody className="buttonArea">

                        <Form onSubmit={this.buyCards.bind(this)}>
                          <ButtonGroup size="lg">
                            {this.state.isMyGo ? <Button type="submit" disabled={this.state.actionsDisabled} color="warning"><b>Keep Cards</b></Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}

                      {/* PLAYING  */}

                      { !!this.state.game && !!this.state.game.round && this.state.game.round.status === "PLAYING" ?
                      <CardBody className="buttonArea">

                          <ButtonGroup size="lg">
                            {this.state.isMyGo ? <Button id="playCardButton" type="button" disabled={this.state.actionsDisabled} onClick={this.playCard.bind(this)} color="warning"><b>Play Card</b></Button> : null }
                          </ButtonGroup> 
                         
                      </CardBody>
                      : null}

                  

                    </div>


                  : null }

                  

                  {/* FINISHED  */}

                  { !!this.state.game && !!this.state.game.me && !!this.state.game && this.state.game.round && this.state.game.status === "FINISHED" ?
                      <CardBody className="buttonArea">
                        
                        <h2>Game Over</h2>
                        
                      </CardBody>
                  : null}
                
                  <CardBody>
                    { !!this.state.game && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players ?
                   

                      <Table dark responsive>
                        <thead>
                          <tr>
                            <th align="left">Avatar</th>
                            <th align="left">Player</th>
                            <th>Previous</th>
                            <th>Bought</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.state.game.playerProfiles.sort(compareScore).map((playerProfile, idx) => 
                          <tr key={`players_${idx}`}>
                            <td>
                              <img alt="Image Preview" src={this.state.players.find(p => p.id === playerProfile.id).picture} className="avatar" />
                            </td>
                            <td>
                              { this.state.players.find(p => p.id === playerProfile.id).name }
                            </td>
                            <td>
                              {!!this.state.previousHand && !!this.state.previousHand.playedCards[playerProfile.id] ?
                              <img alt={this.state.previousHand.playedCards[playerProfile.id]} src={"/cards/thumbnails/" + this.state.previousHand.playedCards[playerProfile.id] + ".png"} className="thumbnail_size_small cardNotSelected"  /> : null }
                            </td>
                            <td>
                              { !!playerProfile.cardsBought ? playerProfile.cardsBought: ""}
                            </td>
                            <td>
                              {playerProfile.score}
                            </td>
                          </tr>
                        )}
                        </tbody>
                      </Table>

                   
                  : null }
                  </CardBody>
              </Card>
            </CardGroup>


            <CardGroup>
              <Card color="secondary">
              <CardBody>
              Back to  <Button type="button" color="link" onClick={this.goHome}><span className="form_container_text_link">Home</span></Button>
              </CardBody>
              </Card>
            </CardGroup>


      <SockJsClient url={ `${process.env.REACT_APP_API_URL}/websocket?gameId=${this.state.gameId}&tokenId=${auth0Client.getAccessToken()}`} topics={["/game", "/user/game"]}
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


</main>
</div>
</span>
</div>
</div>
    );
  }
}

export default Game;
