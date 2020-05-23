import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import Snackbar from "@material-ui/core/Snackbar";
import { Label, Container, Row, Col, Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import shuffleAudio from '../../assets/sounds/shuffle.mp3';
import playCardAudio from '../../assets/sounds/play_card.mp3';
import UIfx from 'uifx';

const shuffleSound = new UIfx(shuffleAudio);
const playCardSound = new UIfx(playCardAudio);

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
    this.handleSuitChange = this.handleSuitChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  getGame() {
    let thisObj = this;

    gameService.getGame().then(response => {
      thisObj.updateGame(response.data, []);
    }).catch(error => {
      thisObj.parseError(error);
    });
  }

  disableButtons() {
    this.updateState({actionsDisabled: true});
  }

  enableButtons() {
    this.updateState({actionsDisabled: false});
  }

  buttonsDisabled() {
    return this.state.actionsDisabled;
  }

  replay(event)  {
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();

    let thisObj = this;
    gameService.replay().then(response => {
      thisObj.updateGame(response.data, [], `Successfully started a new game`);
    }).catch(error => thisObj.parseError(error))
    .finally(() => thisObj.enableButtons());
  };


  deal()  {
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();

    let thisObj = this;
    gameService.deal().then(response => {
      shuffleSound.play();
      thisObj.updateGame(response.data, [], `Successfully dealt cards`);
    }).catch(error => thisObj.parseError(error))
    .finally(() => thisObj.enableButtons());
  };

  call(callAmount)  {
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();

    let thisObj = this;
    gameService.call(callAmount).then(response => {
      thisObj.updateGame(response.data, [], `Successfully called ${callAmount}`);
    }).catch(error => thisObj.parseError(error))
    .finally(() => thisObj.enableButtons());
  };

  selectFromDummy(event) {
    event.preventDefault();
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();
    
    let thisObj = this;

    if (this.state.selectedSuit !== "HEARTS" && this.state.selectedSuit !== "DIAMONDS" && this.state.selectedSuit !== "CLUBS" && this.state.selectedSuit !== "SPADES") {
      this.updateState({snackOpen: true, snackMessage: "Please select a suit!", snackType: "warning"});
      this.enableButtons();
      return;
    }

    let selectedCards = this.state.selectedCards;

    gameService.chooseFromDummy(selectedCards, this.state.selectedSuit).then(response => {
      shuffleSound.play();
      thisObj.updateState({ selectedSuit: null });
      thisObj.updateGame(response.data, selectedCards, `Cards selected`);
      thisObj.enableButtons();
      thisObj.buyCardsIfGoer();
    }).catch(error => thisObj.parseError(error))
    .finally(() => thisObj.enableButtons());
  }

  buyCards(event) {
    if (!!event) {
      event.preventDefault();
    }
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();
    
    let thisObj = this;

    gameService.buyCards(this.state.selectedCards).then(response => {
      shuffleSound.play();
      thisObj.updateGame(response.data, [], `Bought cards`);
    }).catch(error => thisObj.parseError(error))
    .finally(() => thisObj.enableButtons());
  }

  playCard() {
    if (this.buttonsDisabled()) {
      return;
    }
    this.disableButtons();
    
    let thisObj = this;
    let selectedCards = this.state.selectedCards;
    if (selectedCards.length !== 1) {
      this.parseError({message: "Please select exactly one card to play"});
      this.enableButtons();
    } else {
      let selectedCard = selectedCards[0];
      gameService.playCard(selectedCard).then(response => {
        playCardSound.play();
        thisObj.updateGame(response.data, [], `Played ${selectedCard}`);
        thisObj.dealIfDealer();
      }).catch(error => thisObj.parseError(error))
      .finally(() => thisObj.enableButtons());
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

    switch (content.type) {
      case("REPLAY"):
        this.updateGame(content.content.first, this.state.selectedCards, "Game restarting");
        break;
      case("DEAL"):
        shuffleSound.play();
        this.updateGame(content.content.first, this.state.selectedCards, "Cards dealt");
        break;
      case("GAME_OVER"):
        this.updateGame(content.content.first, this.state.selectedCards, "Game Over");
        break;
      case("LAST_CARD_PLAYED"):
        playCardSound.play();
        this.updateGame(content.content.first, this.state.selectedCards);
        break;
      case("CARD_PLAYED"):
        playCardSound.play();
        this.updateGame(content.content.first, this.state.selectedCards);
        this.playIfLastCard();
        break;
      case("BUY_CARDS"):
        this.updateGame(content.content.first, this.state.selectedCards, content.content.second);
        this.buyCardsIfGoer();
        break;
      case("HAND_COMPLETED"):
        this.updateGame(content.content.first, this.state.selectedCards);
        this.playIfLastCard();
        break;
      case("ROUND_COMPLETED"):
        this.updateGame(content.content.first, this.state.selectedCards);
        this.dealIfDealer();
        break;
      case("CALL"):
      case("CHOOSE_FROM_DUMMY"):
        this.updateGame(content.content.first, this.state.selectedCards);
        break;
      default:
        this.parseError({message: "Unsupported content type"})
    }
  }

  playIfLastCard() {
    let thisObj = this;
    if (this.isMyGo() && this.state.me.cards.length === 1) {
      this.enableButtons();
      this.sleep(500).then(() => {
        thisObj.updateState({selectedCards: this.state.me.cards});
        thisObj.playCard();
      });
      
    }
  }

  dealIfDealer() {
    let thisObj = this;
    if (!!this.state.round && this.state.round.status === "CALLING" && this.state.round.dealerId === this.state.myId && this.state.me.cards.length == 0) {
      this.sleep(500).then(() => thisObj.deal());
    }
  }

  buyCardsIfGoer() {
    if (this.state.round.status === "BUYING" && this.iAmGoer() && this.isMyGo()) {
      this.updateState({selectedCards: this.state.me.cards});
      this.buyCards();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isMyGo() {
    return (!!this.state.hand && this.state.hand.currentPlayerId === this.state.myId);
  }

  iAmGoer() {
    return (!!this.state.round && this.state.round.goerId === this.state.myId);
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
    let newState = {game: game, round: round, hand: hand, previousHand: previousHand, me: me, dummy: dummy, maxCall: maxCall, selectedCards: selectedCard, cardsSelectable: cardsSelectable }
    if (!!message) {
      newState.snackOpen = true;
      newState.snackMessage = message;
      newState.snackType = "success";
    }
    this.updateState(newState);
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
                                    

                        <CardBody className="cardArea">
                          <Container>
                            <Row>
                          {this.state.game.players.map( player =>
                              <Col>
                                <div>
                                  {player.displayName}
                                </div>
                             

                                <div>
                               
                              
                                  <img src={(!!this.state.hand.playedCards[player.id] )? "/cards/thumbnails/" + this.state.hand.playedCards[player.id] + ".png" : 
                                   [(this.state.hand.currentPlayerId != player.id)
                                    ?
                                  "/cards/thumbnails/blank_grey_back.png"
                                :   "/cards/thumbnails/yellow_back_blank.png"] } 
                                  
                                  class={(!!this.state.hand.playedCards[player.id] )? "thumbnail_size" : 
                                  [(this.state.hand.currentPlayerId != player.id)
                                    ? "thumbnail_size  transparent " : "thumbnail_size"]
                                        } />
                                      </div>
                                <div>
                               
                              {(this.state.me.id !== player.id && this.state.me.teamId === player.teamId)?<img src={"/cards/thumbnails/PARTNER.png"} />:null}
                              {((this.state.round.dealerId === player.id) && (!this.state.round.goerId)) ? <img src={"/cards/thumbnails/DEALER.png"} />:null}
                              {(player.call===10) ? <img src={"/cards/originals/call_10.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===15) ? <img src={"/cards/originals/call_15.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===20) ? <img src={"/cards/originals/call_20.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===25) ? <img src={"/cards/originals/call_25.png"} class= "thumbnail_size_extra_small"/> : null}
                              {(player.call===30) ? <img src={"/cards/originals/call_jink.png"} class= "thumbnail_size_extra_small"/> : null}

                                </div>
                              </Col>
                          )}
                            </Row>
                          </Container>
                        </CardBody>


                      { !!this.state.me.cards && this.state.me.cards.length > 0 ?
                        <CardBody className="cardArea">
                          { this.state.me.cards.map(card => 
                            <img onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(!this.state.cardsSelectable || this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
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
                        { this.state.me.id == this.state.round.dealerId && this.state.me.cards.length == 0 ?
                        <CardBody className="cardArea">
                          <img onClick={this.deal.bind(this)} src={"/cards/thumbnails/yellow_back_deal.png"} class="thumbnail_size" />
                        </CardBody>
                        : null }
                      </div>
                      : null}

                      {/* Called  */}

                      { !!this.state.round && this.state.round.status === "CALLED" ?
                      <div>

                        {this.iAmGoer() ? 
                          <div>
                            {!!this.state.dummy ?
                            <CardBody className="cardArea">

                              { this.state.dummy.cards.map(card => 
                                <img onClick={this.handleSelectCard.bind(this, card)} src={"/cards/thumbnails/" + card + ".png"} class={(this.state.selectedCards.includes(card)) ? "thumbnail_size":"thumbnail_size cardNotSelected"}/>
                              )}

                            </CardBody>
                            : null }
                            

                            <CardBody className="buttonArea">
                              <Form onSubmit={this.selectFromDummy.bind(this)}>
                                <legend>Suit</legend>

                                <ButtonGroup size="lg">

                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'HEARTS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "HEARTS")}>HEARTS</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'DIAMONDS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "DIAMONDS")}>DIAMONDS</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'SPADES') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "SPADES")}>SPADES</Button>
                                  <Button type="button" disabled={this.state.actionsDisabled} color={(this.state.selectedSuit === 'CLUBS') ? "success":"secondary"} onClick={this.handleSuitChange.bind(this, "CLUBS")}>CLUBS</Button>

                                </ButtonGroup>
                                <br/><br/>
                                <ButtonGroup size="lg">
                                  <Button type="submit" disabled={this.state.actionsDisabled} color="primary">Select Cards</Button>
                                </ButtonGroup>
                                
                              </Form>
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
                            {this.isMyGo() ? <Button type="submit" disabled={this.state.actionsDisabled} color="primary">Buy Cards</Button> : null }
                          </ButtonGroup>
                        </Form>
                          
                      </CardBody>
                      : null}

                      {/* PLAYING  */}

                      { !!this.state.round && this.state.round.status === "PLAYING" ?
                      <CardBody className="buttonArea">

                          <ButtonGroup size="lg">
                            {this.isMyGo() ? <Button id="playCardButton" type="button" disabled={this.state.actionsDisabled} onClick={this.playCard.bind(this)} color="primary">Play Card</Button> : null }
                          </ButtonGroup>
                          
                      </CardBody>
                      : null}

                    { !!this.state.round.suit ?  <div>
                        {(this.state.round.suit === "CLUBS")?<img src={"/cards/originals/clubs.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "DIAMONDS")?<img src={"/cards/originals/diamonds.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "SPADES")?<img src={"/cards/originals/spades.svg"}  class="thumbnail_size_extra_small background_white" />:null}
                              {(this.state.round.suit === "HEARTS")?<img src={"/cards/originals/hearts.svg"}  class="thumbnail_size_extra_small background_white" />:null}
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
                              <img src={"/cards/thumbnails/" + this.state.previousHand.playedCards[player.id] + ".png"} class="thumbnail_size_small cardNotSelected"  /> : null }
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
