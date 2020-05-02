import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import gameService from '../../services/GameService';

import { Modal, ModalBody, ModalHeader, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup, Form, FormGroup, Input, Card, CardBody, CardGroup, CardHeader, Table } from 'reactstrap';
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from '../MySnackbarContentWrapper/MySnackbarContentWrapper.js';
import { blue } from '@material-ui/core/colors';

class Home extends Component {
  constructor(props) {
    super(props);
   
    this.state = { 
      snackOpen: false,
      snackMessage: "",
      snackType: "",
    };
    
    sessionUtils.checkLoggedIn();
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
      <div className="app">
         <div className="game_wrap">
          <div className="game_container">
            <CardGroup>
              <Card className="p-6">
                <CardHeader tag="h1">Cards 110</CardHeader>
                <CardBody>
                  On this page you will start a game
                </CardBody>
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
