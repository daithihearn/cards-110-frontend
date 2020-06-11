import React, { Component } from 'react';
import gameService from '../../services/GameService';
import profileService from '../../services/ProfileService';
import DefaultHeader from '../Header';
import RemoveImage from '../../assets/icons/remove.png';
import AddIcon from '../../assets/icons/add.svg';

import { Modal, ModalBody, ModalHeader, ModalFooter, Label, Button, ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';

import auth0Client from '../../Auth';
class Home extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      activeGames: [],
      snackOpen: false,
      snackMessage: "",
      snackType: "",
      players:[],
      selectedPlayers: [],
      modalStartGame:false,
      modalDeleteGame:false,
      modalDeleteGameIdx: 0,
      modalDeleteGameObject: {},
      isAdmin: false,
      isPlayer: false,
      profileUpdated: false
    };

    this.updateState = this.updateState.bind(this);
    this.showStartGameModal = this.showStartGameModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDeleteGameModal = this.showDeleteGameModal.bind(this);
  }
  
  async componentDidMount() {
    let profile = auth0Client.getProfile();
    let scope = auth0Client.getScope();
    let isAdmin = scope.indexOf("read:admin") !== -1;
    let isPlayer = scope.indexOf("read:game") !== -1;

    let stateUpdate = {profile: profile, isAdmin: isAdmin, isPlayer: isPlayer};
    
    // ADMIN Stuff
    if (isAdmin) {
      this.getActiveGames();
      this.getAllPlayers();
    }

    // Player Stuff
    if (isPlayer) {
      let response = await profileService.hasProfile();
      stateUpdate.profileUpdated = response.data;
      if (!stateUpdate.profileUpdated) {
        stateUpdate.newName = profile.name;
      }
      this.getMyActiveGames();
    }

    this.updateState(stateUpdate);
  }
  
  updateProfile(event) {
    event.preventDefault();
    let thisObj = this;

    let payload = {
      name: this.state.newName
    };

    if (!!this.state.profile.picture) {
      payload.picture = this.state.profile.picture;
    }

    profileService.updateProfile(payload).then(response => {
      thisObj.updateState( { profileUpdated: true, newName: "", snackOpen: true, snackMessage: "Profile updated" , snackType: "success" });
      thisObj.getMyActiveGames();
    })
      .catch(error => thisObj.parseError(error));
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

  getActiveGames()  {
    let thisObj = this;

    gameService.getActive().then(response => {
      thisObj.updateState({ activeGames: response.data });
    })
      .catch(error => thisObj.parseError(error));
  };

  getAllPlayers()  {
    let thisObj = this;

    gameService.getAllPlayers().then(response => {
      thisObj.updateState({ players: response.data });
    })
      .catch(error => thisObj.parseError(error));
  };

  getMyActiveGames()  {
    let thisObj = this;

    gameService.getMyActiveGames().then(response => {
      thisObj.updateState({ myActiveGames: response.data });
    })
      .catch(error => thisObj.parseError(error));
  };

  startGame() {
    if(this.state.selectedPlayers.length < 1) {
      this.updateState( {snackOpen: true, snackMessage: `You must select at least one player` , snackType: "error"} );
      return;
    }
    if (this.state.startGameDisabled) {
      return;
    }
    this.updateState({startGameDisabled: true});

    let thisObj = this;
    let payload = {
      players: this.state.selectedPlayers.map(player => player.id),
      name: this.state.newGameName
    }
    
    gameService.put(payload).then(response => {
      
      let activeGames = thisObj.state.activeGames;
      activeGames.push(response.data);
      thisObj.updateState({startGameDisabled: false, players: [], selectedPlayers: [], modalStartGame: false, activeGames: activeGames, newGameName: ''});
      thisObj.getAllPlayers();
      thisObj.getMyActiveGames();
      thisObj.getActiveGames();
    }).catch(error => {
      thisObj.parseError(error);
      thisObj.updateState({startGameDisabled: false, modalStartGame: false}); 
    });
  };
  
  addPlayer(player, idx) {
    let players = this.state.players;
    let selectedPlayers = this.state.selectedPlayers;
    
    players.splice(idx, 1);
    selectedPlayers.push(player);

    this.updateState( {players: players, selectedPlayers: selectedPlayers, snackOpen: true, snackMessage: `Added player ${player.name}` , snackType: "success"} );
  }

  removePlayer(player, idx) {
    let players = this.state.players;
    let selectedPlayers = this.state.selectedPlayers;
    
    selectedPlayers.splice(idx, 1);
    players.push(player);

    this.updateState( {players: players, selectedPlayers: selectedPlayers, snackOpen: true, snackMessage: `Removed player ${player.name}` , snackType: "warning" });
  }
  
  playGame(game) {
    this.props.history.push({
      pathname: '/game',
      state: { game: game }
    });
  }

  finishGame(game, idx) {
    if (this.state.finishGameDisabled) {
      return;
    }
    this.updateState({finishGameDisabled: true});
    let thisObj = this;
    let activeGames = [...this.state.activeGames];
    activeGames.splice(idx, 1);

    gameService.finish(game.id)
      .then(response => {
        thisObj.updateState({ finishGameDisabled: false, activeGames: activeGames, snackOpen: true, snackMessage: "Game Finished", snackType: "success"  });
        thisObj.getMyActiveGames();
        thisObj.getActiveGames();
      })
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
      .then(response => { 
        thisObj.updateState({ deleteGameDisabled: false, activeGames: activeGames, snackOpen: true, snackMessage: "Game Deleted", snackType: "warning" })
        thisObj.getMyActiveGames();
        thisObj.getActiveGames();
      })
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
      <div>
        <div className="content_employee">
          <span className="app" style={{ overflowX: 'hidden' }}>
            <div className="app_body">
              <main className="main">
                <DefaultHeader />


          <div className="app carpet">
            <div className="game_wrap">
                <div className="game_container">

                { !this.state.isPlayer && !this.state.isAdmin ? 
                  <CardGroup>
                    <Card className="p-6">
                      <CardHeader tag="h2">You are successfully logged in but don't yet have any access permissions. Please contact Daithi to get access.</CardHeader>
                    </Card>
                  </CardGroup>
                  :
                  <div>
                    {/* PLAYER - Section - START */}
                    { this.state.isPlayer ?
                      <div>
                        { this.state.profileUpdated ?
                          <div>
                      
                              { !!this.state.myActiveGames && this.state.myActiveGames.length > 0 ?
                                <CardGroup>
                                  <Card className="p-6">
                                    <CardHeader tag="h2">My Games</CardHeader>
                                  <CardBody>
                                    <Table bordered hover responsive>
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Open</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.state.myActiveGames.map((game, idx) => 
                                          <tr key={`myactivegames_${idx}`}>
                                            <td align="left">{game.name}</td>
                                            <td><Button type="button" color="link" onClick={this.playGame.bind(this, game)}>Open</Button></td>
                                          </tr>
                                          
                                        )}
                                      </tbody>
                                    </Table>
                                  
                                  </CardBody>
                                </Card>
                                </CardGroup>
                                
                                
                                : 
                                <div>
                                  { !this.state.isAdmin ?
                                <CardGroup>
                                  <Card className="p-6">
                                    <CardHeader tag="h2">There are no games available currently. Please wait for the game to start.</CardHeader>
                                  </Card>
                                </CardGroup>
                                  : null }
                                </div>
                              }
                            </div>
                        
                        
                        : 

                        <CardGroup>
                          <Card className="p-6">
                            <CardHeader tag="h2">My Profile</CardHeader>
                            <CardBody>
                              <Form onSubmit={this.updateProfile.bind(this)}>
                                <FormGroup>
                                  <InputGroup>

                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>Name</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupAddon addonType="append">
                                      <Input
                                        type="input"
                                        name="newName"
                                        placeholder="Name"
                                        autoComplete="off"
                                        value={this.state.newName}
                                        onChange={this.handleChange}
                                        required
                                        />
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <ButtonGroup>
                                    <Button type="submit" color="primary">
                                      Update Profile
                                    </Button>
                                  </ButtonGroup> 
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </Card>
                        </CardGroup>
                        }
                      
                      
                      </div>
                    : null }
                    {/* PLAYER - Section - END */}


                    {/* ADMIN - Section - START */}
                    { this.state.isAdmin ?
                      <div>

                        {this.state.activeGames.length > 0 ?  
                            <CardGroup>
                              <Card className="p-6">
                                <CardHeader tag="h2">Active Games</CardHeader>
                              <CardBody>
                                <Table bordered hover responsive>
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
                                      <tr key={`activegames_${idx}`}>
                                        <td align="left">{game.name}</td>
                                        <td><Button type="button" color="link" onClick={this.finishGame.bind(this, game, idx)}>Finish</Button></td>
                                        <td><Button type="button" color="link" onClick={this.showDeleteGameModal.bind(this, game, idx)}>
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
                          <Card>
                            <CardBody><h1>Start a new game</h1></CardBody>
                              <CardBody>
                              
                                  
                                      
                                  <FormGroup>
                                  <h3 colSpan="2">Players</h3>


                                  <Table bordered hover responsive>
                                    <thead>
                                      <tr>
                                        <th>Avatar</th>
                                        <th>Player</th>
                                        <th>Add</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {[].concat(this.state.players).map((player, idx) => (
                                        <tr key={`players_${idx}`}>
                                          <td>
                                            <img alt="Image Preview" src={player.picture} className="avatar" />
                                          </td>
                                          <td>
                                            {player.name}
                                          </td>
                                          <td>
                                              <Button type="button" onClick={this.addPlayer.bind(this, player, idx)} color="link"><img alt="Add" src={AddIcon} width="20px" height="20px"/></Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                            
                                  </FormGroup>
                            </CardBody>


                          {this.state.selectedPlayers.length > 0 ?

                            <CardBody>
                              <h3 colSpan="2">Selected players</h3>

                              <Table bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>Avatar</th>
                                      <th>Player</th>
                                      <th>Remove</th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    {[].concat(this.state.selectedPlayers).map((selectedPlayer, idx) => (
                                      <tr key={`selectedPlayers_${idx}`}>
                                        <td>
                                          <img alt="Image Preview" src={selectedPlayer.picture} className="avatar" />
                                        </td>
                                        <td>
                                          {selectedPlayer.name}
                                        </td>
                                        <td>
                                          <Button type="button" onClick={this.removePlayer.bind(this, selectedPlayer, idx)} color="link"><img alt="Remove" src={RemoveImage} width="20px" height="20px"/></Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              {(!!this.state.selectedPlayers && this.state.selectedPlayers.length > 0) ?
                                    <Form onSubmit={this.showStartGameModal}>
                                      <FormGroup>
                                        <Label for="exampleText">Name</Label>
                                        <Input type="input" 
                                          className="name"
                                          id="newGameName"
                                          name="newGameName"
                                          placeholder="Give the game a name"
                                          autoComplete="off"
                                          onChange={this.handleChange}
                                          value={this.state.newGameName}
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
                                            <Button type="button" color="primary" onClick={this.startGame.bind(this)}>
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

                  </div>
                : null }
                 {/* ADMIN - Section - END */}
                    </div>
                  }

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

export default Home;
