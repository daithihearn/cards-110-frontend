import React, { Component } from 'react';
import RemoveImage from '../../assets/icons/remove.png';

import gameService from '../../services/GameService';

import { Modal, ModalBody, ModalHeader, ModalFooter, Label, Button, ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import errorUtils from '../../utils/ErrorUtils';

class ActiveGames extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      activeGames: [],
      modalDeleteGame:false,
      modalDeleteGameIdx: 0,
      modalDeleteGameObject: {}
    };

    this.updateState = this.updateState.bind(this);
    this.showDeleteGameModal = this.showDeleteGameModal.bind(this);
  }
  
  async componentDidMount() {
    this.getActiveGames();
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

  getActiveGames()  {
    let thisObj = this;

    gameService.getActive().then(response => {
      thisObj.updateState({ activeGames: response.data });
    })
      .catch(error => {
        let stateUpdate = this.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
        this.setState(stateUpdate); 
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
      .then(response => {
        thisObj.updateState({ finishGameDisabled: false, activeGames: activeGames, snackOpen: true, snackMessage: "Game Finished", snackType: "success"  });
        thisObj.getActiveGames();
      })
      .catch(error => {
        let stateUpdate = this.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
        Object.assign(stateUpdate, { finishGameDisabled: false });
        this.setState(stateUpdate); 
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
        thisObj.getActiveGames();
      })
      .catch(error => {
        thisObj.parseError(error); 
        thisObj.updateState({ deleteGameDisabled: false });
      });
    this.handleCloseDeleteGameModal();
  }

  handleCloseDeleteGameModal() {
    this.setState({ modalDeleteGame: false });
  }

  handleClose() {
    this.updateState({ snackOpen: false });
  }
  
  showDeleteGameModal(game, idx) {
    this.setState({ modalDeleteGame: true , modalDeleteGameIdx: idx, modalDeleteGameObject: game});   
  }

  render() {

    return (
      <div>
        {this.state.activeGames.length > 0 ?  
            <CardGroup>
              <Card color="secondary" className="p-6">
                <CardHeader tag="h2">Active Games</CardHeader>
                <CardBody>
                  <Table dark hover responsive>
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
                          <td><Button type="button" color="info" onClick={this.finishGame.bind(this, game, idx)}>Finish</Button></td>
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

export default ActiveGames;
