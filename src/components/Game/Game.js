import React, { Component } from 'react';
import gameService from '../../services/GameService';
import SockJsClient from 'react-stomp';
import { Modal, ModalBody, ModalHeader, Button, ButtonGroup, Form, Row, Col, Card, CardImgOverlay, CardText, CardImg, CardBody, CardTitle, CardGroup, Container, Table, CardHeader } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import DefaultHeader from '../Header';
import Leaderboard from '../Leaderboard';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import uuid from 'uuid-random';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import shuffleAudio from '../../assets/sounds/shuffle.ogg';
import playCardAudio from '../../assets/sounds/play_card.ogg';
import alertAudio from '../../assets/sounds/alert.ogg';

import errorUtils from '../../utils/ErrorUtils';

import auth0Client from '../../Auth';

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
const BLANK = "blank_card";

function playShuffleSound() {
  shuffleSound.play().then(_ => {
    console.log("Shuffle sound played!")
  }).catch(error => {
    console.log("Error playing shuffle sound!")
  });
}

function playPlayCardSound() {
  playCardSound.play().then(_ => {
    console.log("Play card sound played!")
  }).catch(error => {
    console.log("Error playing play card sound!")
  });
}

function playAlertSound() {
  alertSound.play().then(_ => {
    console.log("Alert sound played!")
  }).catch(error => {
    console.log("Error playing alert sound!")
  });
}

function compareHands(hand1, hand2) {
  if (
    !Array.isArray(hand1)
    || !Array.isArray(hand2)
    || hand1.length !== hand2.length
    ) {
      return false;
    }
  
  // .concat() to not mutate arguments
  const arr1 = hand1.concat().filter(ca => ca !== BLANK).sort();
  const arr2 = hand2.concat().filter(ca => ca !== BLANK).sort();
  
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
          return false;
       }
  }
  
  return true;
}

function getStyleForCard (cardsSelectable, selectedCards, card) {
  let classes = "thumbnail_size ";

  let selectedCard = selectedCards.filter(sc => sc.card === card);

  if (cardsSelectable && card !== BLANK) {
    if (selectedCard.length === 1 && selectedCard[0].autoplay) {
      classes += "cardAutoPlayed";
    } else if (selectedCard.length === 0){
      classes += "cardNotSelected";
    }
  }

  return classes;
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

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

function removeFromArray(elementValue, originalArray) {

    let array = [...originalArray]; // make a separate copy of the array
    let index = array.indexOf(elementValue)
    if (index !== -1) {
      array.splice(index, 1);
    }

    return array;
}

function removeAllFromArray(toRemove, originalArray) {
  
  let array = [...originalArray];
  toRemove.forEach(element => {
    array = removeFromArray(element, array);
  });
  return array;
}

function riskOfMistakeBuyingCards(suit, selectedCards, allCards) {

  let deletingCards = removeAllFromArray(selectedCards, allCards);

  for (var i = 0; i < deletingCards.length; i++) {
    if (deletingCards[i] === "JOKER" || deletingCards[i] === "ACE_HEARTS" || deletingCards[i].split("_")[1] === suit) {
      return true;
    }
  }

  return false;
}

function setMyCards(cards) {
  let myCards = [...cards];

  for(let i=0; i< 5-cards.length;i++) {
    myCards.push(BLANK);
  }

  return myCards;
}

function removeCard(cardToRemove, cards) {
  let myCards = [...cards]; // make a separate copy of the array
    let index = myCards.indexOf(cardToRemove)
    if (index !== -1) {
      myCards[index] = BLANK;
    }

    return myCards;
}

class Game extends Component {
  constructor(props) {
    super(props);
    
    if (!props.location.state || !props.location.state.gameId) {
      this.updateState(errorUtils.parseError({message: "No Game provided"}));
      return;
    }

    this.state = {
      isMyGo: false,
      iAmGoer: false,
      iAmDealer: false,
      gameId: props.location.state.gameId,
      selectedCards: [],
      actionsDisabled: false,
      modalLeaderboard: false,
      deleteCardsDialog: false,
      cancelSelectFromDummyDialog: false,
      myCards: [BLANK, BLANK, BLANK, BLANK, BLANK]
    };

    this.goHome = this.goHome.bind(this);
    this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
    this.toggleLeaderboardModal = this.toggleLeaderboardModal.bind(this);
    this.hideCancelDeleteCardsDialog = this.hideCancelDeleteCardsDialog.bind(this);
    this.showCancelDeleteCardsDialog = this.showCancelDeleteCardsDialog.bind(this);
    this.hideCancelSelectFromDummyDialog = this.hideCancelSelectFromDummyDialog.bind(this);
    this.submitBuyCards = this.submitBuyCards.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  handleOnDragEnd(result) {
    if (!result.destination) return;

    const cards = Array.from(this.state.myCards);
    const [reorderedItem] = cards.splice(result.source.index, 1);
    cards.splice(result.destination.index, 0, reorderedItem);

    this.setState({ myCards: cards });
  }

  toggleLeaderboardModal() {
    let state = this.state.modalLeaderboard;
    this.setState({ modalLeaderboard: !state });
  }

  hideCancelDeleteCardsDialog() {
    this.setState({ deleteCardsDialog: false });
  }

  showCancelDeleteCardsDialog() {
    this.setState({ deleteCardsDialog: true });
  }

  hideCancelSelectFromDummyDialog() {
    this.setState({ cancelSelectFromDummyDialog: false, selectedSuit: undefined });
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

      // If I am calling populate myCards with the dummy
      if (!!state.game && !!state.game.round && state.iAmGoer && state.game.round.status === "CALLED") {
        Object.assign(state, { myCards: setMyCards(gameRes.data.cards.concat(gameRes.data.dummy))});  
      } else {
        Object.assign(state, { myCards: setMyCards(gameRes.data.cards)});
      }

      this.setState(state);

      if (!!state.game.round && state.game.round.status === "CALLING" && state.iAmDealer && state.game.cards.length === 0) {
        sleep(500).then(() => this.deal());
      }
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
        playAlertSound();
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
    Object.assign(state, {selectedCards: []});
    thisObj.setState(state);

    gameService.deal(this.state.gameId).then(response => {
      playShuffleSound();
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
      Object.assign(state, {selectedCards: []});
      thisObj.setState(stateUpdate); 
    });
  };

  selectFromDummy(suit) {
    if (this.buttonsDisabled()) {
      return;
    }

    let thisObj = this;
    let state = this.state;

    // Make sure a suit was selected
    if (suit !== "HEARTS" && suit !== "DIAMONDS" && suit !== "CLUBS" && suit !== "SPADES") {
      Object.assign(state, thisObj.updateState({snackOpen: true, snackMessage: "Please select a suit!", snackType: "warning"}));
      Object.assign(state, enableButtons());
      Object.assign(state, thisObj.cancelAlert());
      thisObj.setState(state);  
      return;
    }

    // Check if there is a risk that they made a mistake when selecting the cards
    if (riskOfMistakeBuyingCards(suit, this.state.selectedCards.map(sc => sc.card), this.state.game.cards.concat(this.state.game.dummy))) {
      Object.assign(state, { cancelSelectFromDummyDialog: true, selectedSuit: suit });
      thisObj.setState(state);  
      return;
    } else {
      this.submitSelectFromDummy(suit);
    }
  }

  buyCards(event) {
    if (!!event) {
      event.preventDefault();
    }
    if (this.buttonsDisabled()) {
      return;
    }
    if(riskOfMistakeBuyingCards(this.state.game.round.suit, this.state.selectedCards.map(sc => sc.card), this.state.game.cards)) {
      this.showCancelDeleteCardsDialog();
    } else {
      this.submitBuyCards();
    }
  }

  submitBuyCards() {
    let thisObj = this;
    let state = this.state;
    let selectedCards = this.state.selectedCards.map(sc => sc.card);
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    Object.assign(state, {selectedCards: []});
    thisObj.setState(state);

    gameService.buyCards(this.state.gameId, selectedCards).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      Object.assign(state, {selectedCards: []});
      thisObj.setState(stateUpdate); 
    });
  }

  submitSelectFromDummy(suit) {
    let thisObj = this;
    let state = this.state;
    let selectedCards = this.state.selectedCards.map(sc => sc.card);
    Object.assign(state, thisObj.cancelAlert());
    Object.assign(state, disableButtons());
    Object.assign(state, {selectedCards: []});

    thisObj.setState(state);

    gameService.chooseFromDummy(this.state.gameId, selectedCards, suit).catch(error => {
      let stateUpdate = thisObj.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
      Object.assign(stateUpdate, enableButtons());
      Object.assign(state, {selectedCards: []});
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
      
      let selectedCard = selectedCards[0].card;
      let myCardsBefore = [...state.myCards];
      Object.assign(state, { myCards: removeCard(selectedCard, state.myCards), selectedCards: []});
      thisObj.setState(state);
      gameService.playCard(this.state.gameId, selectedCard).catch(error => {
        let stateUpdate = thisObj.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
        Object.assign(stateUpdate, enableButtons());
        Object.assign(stateUpdate, {selectedCards: []});
        Object.assign(stateUpdate, { myCards: myCardsBefore});
        thisObj.setState(stateUpdate); 
      });
    }
  }

  handleSelectCard(card) {
    if (!this.state.cardsSelectable || card === BLANK) {
      return
    }
    let state = this.state;
    Object.assign(state, this.cancelAlert());

    let selectedCards = state.selectedCards;
    let indexOfCard = selectedCards.map(sc => sc.card).indexOf(card);

    // If the round status is PLAYING then only allow one card to be selected
    if (this.state.game.round.status === "PLAYING") {
      if (!!this.state.doubleClickTracker && this.state.doubleClickTracker.card === card && (Date.now() - this.state.doubleClickTracker.time < 600 )) {
        selectedCards = [{ card: card, autoplay: true}];
      } else if (indexOfCard === -1) {
        
        selectedCards = [{ card: card, autoplay: false}];
        Object.assign(state, {doubleClickTracker: { time: Date.now(), card: card}});

      } else {
        selectedCards = [];
        Object.assign(state, {doubleClickTracker: { time: Date.now(), card: card}});
      }
    } 
    else {
      if (indexOfCard === -1) {
        selectedCards.push({card: card});
      } else {
        selectedCards.splice(indexOfCard, 1);
      }
    }

    Object.assign(state, {selectedCards: selectedCards});
    this.setState(state);
    if (state.game.round.status === "PLAYING" && state.isMyGo && selectedCards.length === 1 && selectedCards[0].autoplay) {
      this.playCard();
    }
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
        Object.assign(state, {selectedCards: []});
        break;
      case("DEAL"):
        playShuffleSound();
        Object.assign(state, thisObj.updateGame(content.content));
        Object.assign(state, {selectedCards: []});
        Object.assign(state, { myCards: setMyCards(content.content.cards)});
        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }
        break;
      case("GAME_OVER"):
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content));
        Object.assign(state, {selectedCards: []});
        Object.assign(state, enableButtons());
        break;
      case("LAST_CARD_PLAYED"):
        playPlayCardSound()
        Object.assign(state, thisObj.cancelAlert());
        Object.assign(state, thisObj.updateGame(content.content));
        break;
      case("CARD_PLAYED"):
        playPlayCardSound();
        Object.assign(state, thisObj.updateGame(content.content));

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
        }
        
        if (state.isMyGo && (state.game.cards.length === 1 || state.selectedCards.filter(card => card.autoplay).length > 0)) {
          if (state.game.cards.length === 1) {
            Object.assign(state, {selectedCards: [{card: state.game.cards[0]}]});
          }
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
        Object.assign(state, { deleteCardsDialog: false });
        Object.assign(state, { myCards: setMyCards(content.content.cards)});

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }

        // If I'm the goer and it's my go then just auto buy
        if (state.game.round.status === "BUYING" && state.iAmGoer && state.isMyGo) {
          Object.assign(state, { selectedCards: state.game.cards.filter(card => card !== BLANK).map(sc => new Object({card: sc})) });
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

        if (state.isMyGo && state.game.cards.length === 1 || state.selectedCards.filter(card => card.autoplay).length > 0) {
          if (state.game.cards.length === 1) {
            Object.assign(state, {selectedCards: [{card: state.game.cards[0]}]});
          }
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
        Object.assign(state, {selectedCards: []});

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
        Object.assign(state, {selectedCards: []});
        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }
        if (!!state.game && !!state.game.round && state.iAmGoer && state.game.round.status === "CALLED") {
          Object.assign(state, { myCards: setMyCards(content.content.cards.concat(content.content.dummy))});  
        }
        break;
      case("CHOOSE_FROM_DUMMY"):

        Object.assign(state, thisObj.updateGame(content.content));
        Object.assign(state, { cancelSelectFromDummyDialog: false });
        Object.assign(state, { myCards: setMyCards(content.content.cards)});

        if (state.isMyGo) {
          Object.assign(state, enableButtons());
          Object.assign(state, thisObj.setAlert());
        }

        if (state.game.round.status === "BUYING" && state.iAmGoer && state.isMyGo) {
          Object.assign(state, { selectedCards: state.game.cards.filter(card => card !== BLANK).map(sc => new Object({card: sc})) });
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

    return { game: game, previousHand: previousHand, cardsSelectable: cardsSelectable, 
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

          { !!this.state.game && this.state.game.status !== "FINISHED" ?

            <CardGroup>
              <Card className="p-6 tableCloth" inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>

              { !!this.state.game && !!this.state.game.me && !!this.state.game.round && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players && this.state.game.status !== "FINISHED" ?
                    <div>

                        <CardHeader className="cardAreaHeaderContainer">
                          <Container>
                            <Row>
                              <Col xs="0">
                                <Button type="button" className="float-left leaderboard-button" color="info" onClick={this.toggleLeaderboardModal}><img className="thumbnail_size_extra_small" alt="Leaderboard" src="/assets/img/leaderboard.png"/></Button>
                              </Col>
                              
                              { !!this.state.game.round.suit ?
                                <Col xs="9">
                                <h2 className="cardAreaHeader">
                                  <CardImg alt={this.state.players.find(p => p.id === this.state.game.round.goerId).name} src={this.state.players.find(q => q.id === this.state.game.round.goerId).picture} className="thumbnail_size_extra_small" />
                                  
                                  <CardImg alt="Chip" src={`/cards/originals/call_${this.state.game.playerProfiles.filter(profile => profile.id === this.state.game.round.goerId)[0].call}.png`} className= "thumbnail_size_extra_small left-padding"/>
                                  
                                  <CardImg alt="Suit" src={`/cards/originals/${this.state.game.round.suit}_ICON.svg`}  className="thumbnail_size_extra_small left-padding" />
                                </h2>
                                </Col>
                                : null}

                              { this.state.game.me.id !== this.state.game.round.dealerId && this.state.game.cards.length === 0 ?
                                  <Col>
                                    <div className="game-heading"><h4>Waiting...</h4></div>
                                  </Col>
                                : null}

                                { !!this.state.game.round && this.state.game.round.status === "CALLED" && !this.state.iAmGoer ?
                                  <Col>
                                    <div className="game-heading"><h4>Waiting...</h4></div>
                                  </Col>
                                : null}
                            </Row>
                          </Container>
                        </CardHeader>
                        
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
                                          <CardImg alt="Dealer Chip" src={"/cards/originals/DEALER.png"} className= "thumbnail_chips overlay-dealer-chip"/>
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

                        { !!this.state.game.me && !!this.state.myCards ?
                          <CardBody className="cardArea">

                            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                              <Droppable droppableId="characters" direction="horizontal">
                                {(provided) => (
                                  <div className="characters" style={{ display: "inline-flex" }} {...provided.droppableProps} ref={provided.innerRef}>
                                    {this.state.myCards.map((card, index) => {
                                      return (
                                        
                                        <Draggable key={card + index} draggableId={card + index} index={index} isDragDisabled={card === BLANK}>
                                          {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                              <CardImg alt={card} onClick={this.handleSelectCard.bind(this, card)} 
                                                src={"/cards/thumbnails/" + card + ".png"} 
                                                className={ getStyleForCard(this.state.cardsSelectable, this.state.selectedCards, card)}/>
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    })}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>

                          </CardBody>
                        : null }

                      {/* Calling  */}

                      { !!this.state.game.round && this.state.game.round.status === "CALLING" ?
                      <div>
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

                            : 
                            <ButtonGroup size="lg">
                              <Button type="button" color="warning" disabled={true}>Please wait your turn...</Button>
                            </ButtonGroup>}
                            
                        </CardBody>
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

                      {/* CALLED */}
                      {!!this.state.game && !!this.state.game.round && this.state.iAmGoer && this.state.game.round.status === "CALLED" ?
              
                        <CardBody className="buttonArea">

                            <ButtonGroup size="lg">

                              <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "HEARTS")}><img alt="Hearts" src={"/cards/originals/HEARTS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                              <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "DIAMONDS")}><img alt="Hearts" src={"/cards/originals/DIAMONDS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                              <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "SPADES")}><img alt="Hearts" src={"/cards/originals/SPADES_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>
                              <Button type="button" disabled={this.state.actionsDisabled} color="secondary" onClick={this.selectFromDummy.bind(this, "CLUBS")}><img alt="Hearts" src={"/cards/originals/CLUBS_ICON.svg"}  className="thumbnail_size_extra_small " /></Button>

                            </ButtonGroup>
                            
                        </CardBody>
                      : null}

                    </div>

                  : null }

              </Card>
            </CardGroup>
            : null}


            {/* FINISHED  */}
            { !!this.state.game && !!this.state.game.me && !!this.state.game && this.state.game.round && this.state.game.status === "FINISHED" ?
                <CardGroup>
                  <Card color="secondary" className="p-6">
                  <CardHeader className="cardAreaHeaderContainer" tag="h2">
                    Game Over
                  </CardHeader>
                  <CardBody>
                    { !!this.state.game && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players ?
                    <Container>
                      <Leaderboard playerProfiles={this.state.game.playerProfiles} players={this.state.players} currentHand={this.state.currentHand} gameOver={true}/>
                    </Container>
                    : null}
                    
                  </CardBody>
                </Card>
                </CardGroup>
            : null}


            { !!this.state.game && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players ?
            
            <Modal fade={true} size="lg" toggle={this.toggleLeaderboardModal} isOpen={this.state.modalLeaderboard}>
              <ModalBody className="gameModalBody">
                <Leaderboard playerProfiles={this.state.game.playerProfiles} players={this.state.players} currentHand={this.state.currentHand} previousHand={this.state.previousHand}/>
              </ModalBody> 
            </Modal>

            
          : null }

          { !!this.state.game && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players && !!this.state.game.round.suit ?
            <Modal fade={true} size="lg" toggle={this.hideCancelDeleteCardsDialog} isOpen={this.state.deleteCardsDialog}>

                <ModalHeader><CardImg alt="Suit" src={`/cards/originals/${this.state.game.round.suit}_ICON.svg`}  className="thumbnail_size_extra_small left-padding" /> Are you sure you want to throw these cards away?</ModalHeader>
                <ModalBody className="called-modal">
                <CardGroup className="gameModalCardGroup">
                  <Card className="p-6 tableCloth" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <CardBody className="cardArea">

                      { removeAllFromArray(this.state.selectedCards.map(sc => sc.card), this.state.myCards).map(card => 
                        <img alt={card} src={"/cards/thumbnails/" + card + ".png"} className="thumbnail_size"/>
                      )}

                    </CardBody>

                    

                    <CardBody className="buttonArea">

                        <ButtonGroup size="lg">
                          <Button type="button" color="primary" onClick={this.hideCancelDeleteCardsDialog}>Cancel</Button>
                          <Button type="button" color="warning" onClick={this.submitBuyCards}>Throw Cards</Button>
                        </ButtonGroup>
                        
                    </CardBody>
                  </Card>
                </CardGroup>
              </ModalBody>
            </Modal>
          : null }


          { !!this.state.game && !!this.state.game.round.currentHand && !!this.state.game.playerProfiles && !!this.state.players && !!this.state.game.dummy && !! this.state.selectedSuit ?
            <Modal fade={true} size="lg" toggle={this.hideCancelSelectFromDummyDialog} isOpen={this.state.cancelSelectFromDummyDialog}>

                <ModalHeader><CardImg alt="Suit" src={`/cards/originals/${this.state.selectedSuit}_ICON.svg`}  className="thumbnail_size_extra_small left-padding" /> Are you sure you want to throw these cards away?</ModalHeader>
                <ModalBody className="called-modal">
                <CardGroup className="gameModalCardGroup">
                  <Card className="p-6 tableCloth" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <CardBody className="cardArea">

                      { removeAllFromArray(this.state.selectedCards.map(sc => sc.card), this.state.myCards).map(card => 
                        <img alt={card} src={"/cards/thumbnails/" + card + ".png"} className="thumbnail_size"/>
                      )}

                    </CardBody>

                    <CardBody className="buttonArea">

                        <ButtonGroup size="lg">
                          <Button type="button" color="primary" onClick={this.hideCancelSelectFromDummyDialog}>Cancel</Button>
                          <Button type="button" color="warning" onClick={this.submitSelectFromDummy.bind(this, this.state.selectedSuit)}>Throw Cards</Button>
                        </ButtonGroup>
                        
                    </CardBody>
                  </Card>
                </CardGroup>
              </ModalBody>
            </Modal>
          : null }

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
          onClose={this.handleClose.bind(this)} >
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
