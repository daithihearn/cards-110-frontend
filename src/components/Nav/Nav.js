import axios from 'axios';
import React, { Component } from 'react';
import sessionUtils from '../../utils/SessionUtils';
import sidebarImage from '../../assets/img/brand/sidebar_image.png';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersName: '',
      profilePicture: ''
    };
    sessionUtils.checkLoggedIn();
  }

  componentWillMount() {
    this.loadUsersName();
  }

  loadUsersName = () => {
    let thisObj = this;
    let authHeader = sessionStorage.getItem('JWT-TOKEN');

    if (authHeader) {
    let config = {
      headers: {
        Authorization: authHeader
      }
    };
    const result = axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/session/name`, config)
      .then(function(response) {
        let username = response.data;
        let atIndex = username.indexOf('@');

        if (atIndex !== -1) {
          username = username.substring(0, atIndex);
        }

        thisObj.setState(
          Object.assign(thisObj.state, {
            usersName: username
          })
        );
      })
      .catch(error => console.error('Error occurred in fetching gamer details: ', error));
    }
  }

  render() {
    return (
      <div className="navigation_Tab">
        <div className="navigation_Tab_container">
          {/* <div className="navigation_Tab_logo">
            <img className="navigation_Tab_logo_image" src={logo} alt="description" />
          </div>  */}
          <div className="navigation_Tab_content">
            <img className="navigation_Tab_ProfilePic" src={sidebarImage} alt="description" />
            <div className="navigation_Tab_Title"> Hi {this.state.usersName} </div>
          </div>
        </div>
        <div className="navigation_Tab_line" />
      </div>
    );
  }
}

export default Nav;
