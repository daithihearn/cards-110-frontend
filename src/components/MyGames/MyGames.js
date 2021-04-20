import React, { Component } from 'react';
import gameService from '../../services/GameService';

import { Modal, ModalBody, ModalHeader, ModalFooter, Label, Button, ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import errorUtils from '../../utils/ErrorUtils';

class MyGames extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      myActiveGames: []
    };

    this.updateState = this.updateState.bind(this);
  }
  
  async componentDidMount() {
    this.getMyActiveGames();
  }

  updateState(stateDelta) {
    this.setState(prevState => (stateDelta));
  }

  getMyActiveGames()  {
    let thisObj = this;

    gameService.getMyActiveGames().then(response => {
      thisObj.updateState({ myActiveGames: response.data });
    })
      .catch(error => {
        let stateUpdate = this.state;
        Object.assign(stateUpdate, errorUtils.parseError(error));
        this.setState(stateUpdate); 
      });
  };
  
  playGame(game) {
    this.props.history.push({
      pathname: '/game',
      state: { gameId: game.id }
    });
  }

  render() {

    return (
      <div>

        { !!this.state.myActiveGames && this.state.myActiveGames.length > 0 ?
        <CardGroup>
          <Card color="secondary" className="p-6">
            <CardHeader tag="h2">My Games</CardHeader>
          <CardBody>
            <Table dark hover responsive>
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
                    <td><Button type="button" color="success" onClick={this.playGame.bind(this, game)}>Open</Button></td>
                  </tr>
                  
                )}
              </tbody>
            </Table>
          
          </CardBody>
        </Card>
        </CardGroup>
        
        : 

        <CardGroup>
          <Card color="secondary" className="p-6">
            <CardHeader tag="h2">There are no games available currently. Please wait for the game to start.</CardHeader>
          </Card>
        </CardGroup>

      }
    </div>
    );
  }
}

export default MyGames;
