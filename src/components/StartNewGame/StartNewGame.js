import React, { Component } from 'react';
import RemoveImage from '../../assets/icons/remove.png';
import AddIcon from '../../assets/icons/add.svg';

import gameService from '../../services/GameService';

import { Modal, ModalBody, ModalHeader, ModalFooter, Label, Button, ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import BlockUi from 'react-block-ui';
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import errorUtils from '../../utils/ErrorUtils';

class StartNewGame extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      snackOpen: false,
      snackMessage: "",
      snackType: "",
      players:[],
      loadingPlayers: false,
      selectedPlayers: [],
      modalStartGame:false,
    };

    this.showStartGameModal = this.showStartGameModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }
  
  async componentDidMount() {
    this.getAllPlayers();
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

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

  getAllPlayers()  {
    let thisObj = this;

    this.updateState({loadingPlayers: true});

    gameService.getAllPlayers().then(response => {
      thisObj.updateState({ players: response.data, loadingPlayers: false });
    })
      .catch(error => {
        let stateUpdate = this.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
        Object.assign(stateUpdate, {loadingPlayers: false });
        this.setState(stateUpdate); 
      });
  };

  handleCloseStartGameModal() {
    this.setState({ modalStartGame: false });
  }
  showStartGameModal(event) {
    event.preventDefault();
    this.setState({ modalStartGame: true });
  }

  startGame() {
    if(this.state.selectedPlayers.length < 1) {
      this.updateState( {snackOpen: true, snackMessage: `You must select at least one player` , snackType: "error"} );
      return;
    }
    if(this.state.newGameName === "") {
      this.updateState( {snackOpen: true, snackMessage: `You must provide a name for the game` , snackType: "error"} );
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
      thisObj.updateState({startGameDisabled: false, players: [], selectedPlayers: [], modalStartGame: false, newGameName: ''});
      thisObj.getAllPlayers();
    }).catch(error => {
      let stateUpdate = this.state;
      Object.assign(stateUpdate, errorUtils.parseError(error));
      Object.assign(stateUpdate, {startGameDisabled: false, modalStartGame: false});
      this.setState(stateUpdate); 
    });
  };

  handleClose() {
    this.updateState({ snackOpen: false });
  }

  handleChange(event) {
    let key = event.target.getAttribute("name");
    let updateObj = { [key]: event.target.value };
    this.updateState(updateObj);
  }

  render() {

    return (
      <div>
        <BlockUi tag="div" blocking={this.state.loadingPlayers}>
          <CardGroup>
            <Card color="secondary">
              <CardBody><h1>Start a new game</h1></CardBody>
                <CardBody>

                    <FormGroup>
                    <h3 colSpan="2">Players</h3>


                    <Table dark hover responsive>
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

                <Table dark hover responsive>
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
                {(!!this.state.selectedPlayers && this.state.selectedPlayers.length > 1) ?
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
                        {(!!this.state.newGameName && this.state.newGameName !== "") ?
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
                        : null}
                      </Form>
                        : null}
              </CardBody>
            : null}


          </Card>
        </CardGroup>
        </BlockUi>
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
    );
  }
}

export default StartNewGame;
