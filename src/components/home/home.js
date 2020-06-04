import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';
import RemoveImage from '../../assets/icons/remove.png';

import { Label, Modal, ModalBody, ModalHeader, ModalFooter, Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';

class Home extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      activeGames: [],
      snackOpen: false,
      snackMessage: "",
      snackType: "",
      players:[],
      currentUsername: '',
      currentEmail: '',
      modalStartGame:false,
      modalDeleteGame:false,
      modalDeleteGameIdx: 0,
      modalDeleteGameObject: {},
      emailMessage: ""
    };
    
    sessionUtils.checkLoggedIn();

    this.getActiveGames();

    this.updateState = this.updateState.bind(this);
    this.showStartGameModal = this.showStartGameModal.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDeleteGameModal = this.showDeleteGameModal.bind(this);
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

  getActiveGames()  {
    let thisObj = this;

    gameService.getActive().then(response => {
      thisObj.updateState({ activeGames: response.data });
    })
      .catch(error => thisObj.parseError(error));
  };

  addPlayer(event) {
    event.preventDefault();
    let updatedPlayers = this.state.players;
    updatedPlayers.push({ email: this.state.currentEmail, displayName: this.state.currentUsername });

    this.updateState( {players: updatedPlayers, currentEmail: '', currentUsername: '', snackOpen: true, snackMessage: "Player Added", snackType: "success" });
  }

  removePlayer(idx) {
    let updatedPlayers = [...this.state.players];
    updatedPlayers.splice(idx, 1);
    this.setState({ players: updatedPlayers, snackOpen: true, snackMessage: "Player Removed", snackType: "warning"  });
  }

  handleCloseStartGameModal() {
    this.setState({ modalStartGame: false });
  }
  showStartGameModal(event) {
    event.preventDefault();
    this.setState({ modalStartGame: true });
  }

  handleCloseDeleteGameModal() {
    this.setState({ modalDeleteGame: false });
  }
  showDeleteGameModal(game, idx) {
    this.setState({ modalDeleteGame: true , modalDeleteGameIdx: idx, modalDeleteGameObject: game});   
  }

  startGameWithEmails() {
    if (this.state.startGameDisabled) {
      return;
    }
    this.updateState({startGameDisabled: true});

    let thisObj = this;
    let createGamePayload = {
      name: this.state.name,
      createPlayers: this.state.players,
      emailMessage: this.state.emailMessage
    }
    
    gameService.put(createGamePayload).then(response => {
      
      let activeGames = thisObj.state.activeGames;
      activeGames.push(response.data);
      thisObj.updateState({startGameDisabled: false, activeGames: activeGames, name: '', players: [], emailMessage: ''});
    }).catch(error => {
      thisObj.parseError(error);
      thisObj.updateState({startGameDisabled: false}); 
    });
  };

  finishGame(game, idx) {
    if (this.state.finishGameDisabled) {
      return;
    }
    this.updateState({finishGameDisabled: true});
    let thisObj = this;
    let activeGames = [...this.state.activeGames];
    activeGames.splice(idx, 1);

    gameService.finish(game.id)
      .then(response => thisObj.updateState({ finishGameDisabled: false, activeGames: activeGames, snackOpen: true, snackMessage: "Game Finished", snackType: "success"  }))
      .catch(error => { 
        thisObj.parseError(error); 
        thisObj.updateState({ finishGameDisabled: false });  
      });
    this.handleCloseDeleteGameModal();
  }

  deleteGame() {
    if (this.state.deleteGameDisabled) {
      return;
    }
    this.updateState({deleteGameDisabled: true});
    let thisObj = this;
    let activeGames = [...this.state.activeGames];
    activeGames.splice(this.state.modalDeleteGameIdx, 1);

    gameService.delete(this.state.modalDeleteGameObject.id)
      .then(response => thisObj.updateState({ deleteGameDisabled: false, activeGames: activeGames, snackOpen: true, snackMessage: "Game Deleted", snackType: "warning"  }))
      .catch(error => {
        thisObj.parseError(error); 
        thisObj.updateState({ deleteGameDisabled: false });  
      });
    this.handleCloseDeleteGameModal();
  }

  handleClose() {
    this.updateState({ snackOpen: false });
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


          {this.state.activeGames.length > 0 ?  
              <CardGroup>
                <Card className="p-6">
                  <CardHeader tag="h2">Active Games</CardHeader>
                <CardBody>
                  <Table  size="sm" bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Finish</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>

                      <Modal isOpen={this.state.modalDeleteGame}>
                        <ModalHeader closeButton>
                          You are about to Delete a game
                        </ModalHeader>
                        
                        <ModalBody>Are you sure you want to delete 
                        { !! this.state.modalDeleteGameObject ?
                          <b>&nbsp;{this.state.modalDeleteGameObject.name}&nbsp;</b>  : null }
                        
                          game? It is an active game</ModalBody> 
                          
                        <ModalFooter>
                        <Button color="secondary" onClick={this.handleCloseDeleteGameModal.bind(this)}>
                            No
                          </Button>
                            <Button color="primary" onClick={this.deleteGame.bind(this)}>
                          Yes
                            </Button>
                        </ModalFooter>
                      </Modal>
                      {this.state.activeGames.map((game, idx) => 
                        <tr>
                          <td align="left">{game.name}</td>
                          <td><Button type="button" color="link" onClick={this.finishGame.bind(this, game, idx)}>Finish</Button></td>
                          <td><Button type="button" color="danger" onClick={this.showDeleteGameModal.bind(this, game, idx)}>
                            <img alt="Remove" src={RemoveImage} width="20px" height="20px"/></Button>                  
                            </td>
                        </tr>
                        
                      )}
                    </tbody>
                  </Table>
                 
                </CardBody>
              </Card>
              </CardGroup>
            : null}



            <CardGroup>
              <Card  body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <CardBody><h1>Start a new game</h1></CardBody>
                  <CardBody>
                    <Form onSubmit={this.addPlayer}>
                      <FormGroup>
                        <h4 colSpan="2">Add players below</h4>
                          <Label for="currentUsername">Username</Label>
                          <Input
                            className="currentUsername"
                            id="currentUsername"
                            type="input"
                            name="currentUsername"
                            placeholder="Username"
                            autoComplete="off"
                            onChange={this.handleChange}
                            value={this.state.currentUsername}
                            required
                          />
                      </FormGroup>
                      <FormGroup>
                          <Label for="currentEmail">Email</Label>
                          <Input
                            className="currentEmail"
                            id="currentEmail"
                            type="input"
                            pattern={"(?:[a-z0-9!#\$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#\$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"}
                            name="currentEmail"
                            placeholder="Email"
                            autoComplete="off"
                            onChange={this.handleChange}
                            value={this.state.currentEmail}
                            required
                          />
                      </FormGroup>
                      <ButtonGroup>
                        <Button type="submit" size="lg" color="primary">Add Player</Button>
                      </ButtonGroup>
                        
                    </Form>
                  </CardBody>


                    {this.state.players.length > 0 ?

                      <CardBody>
                        <Table dark responsive>
                          <thead>
                            <tr>
                              <th>Players Added</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                          {this.state.players.map((player, idx) =>
                            <tr key={player.id}>
                              <td align="left" key={player.id + "name"}>{player.displayName}</td>
                              <td key={player.id + "emailMessage"}>
                              <Button color="link" type="button" onClick={this.removePlayer.bind(this, idx)}><img alt="Remove" src={RemoveImage} width="20px" height="20px"/></Button></td>
                            </tr>
                          )}
                          </tbody>
                        </Table>
                        {(!!this.state.players && this.state.players.length > 0) ?
                              <Form onSubmit={this.showStartGameModal}>
                                <FormGroup>
                                  <Label for="exampleText">Name</Label>
                                  <Input type="input" 
                                    className="name"
                                    id="name"
                                    name="name"
                                    placeholder="Give the game a name"
                                    autoComplete="off"
                                    onChange={this.handleChange}
                                    value={this.state.name}
                                    required />
                                </FormGroup>
                                <FormGroup>
                                  <Label for="emailMessage">Message</Label>
                                  <Input type="textarea" 
                                    className="emailMessage"
                                    id="emailMessage"
                                    name="emailMessage"
                                    placeholder="Enter a message to appear in the email invite. Include web conference details here if you have them."
                                    autoComplete="off"
                                    onChange={this.handleChange}
                                    value={this.state.emailMessage}
                                    required />
                                </FormGroup>
                                <ButtonGroup>
                                  <Button size="lg" color="primary" type="submit" onClick={this.showStartGameModal.bind(this)}>
                                    Start Game 
                                  </Button> 
                                  <Modal isOpen={this.state.modalStartGame}>
                                    <ModalHeader closeButton>
                                      You are about to start a game
                                    </ModalHeader>
                                    <ModalBody>Are you sure you want to start the game?</ModalBody>
                                    <ModalFooter>
                                      <Button type="button" color="secondary" onClick={this.handleCloseStartGameModal.bind(this)}>
                                        No
                                      </Button>
                                      <Button type="button" color="primary" onClick={this.startGameWithEmails.bind(this)}>
                                        Yes
                                      </Button>
                                    </ModalFooter>
                                  </Modal>
                                </ButtonGroup>
                              </Form>
                                : null}
                      </CardBody>
                    : null}


              </Card>
            </CardGroup>

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

export default Home;
