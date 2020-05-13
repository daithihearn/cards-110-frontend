import React, { Component } from 'react';

import Logo from '../../assets/img/brand/logo.png';
import sessionUtils from '../../utils/SessionUtils';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchActive: false,
      queryString: '',
      _searchResults: null,
      placeholder: 'Search'
    };
  }

  openSearchpage = () => {
    this.props.showSearch();
  };

  closeSearchpage = () => {
    this.props.hideSearch();
    this.onFocus();
  };

  clearText = () => {
    this.setState({
      placeholder: ''
    });
  };

  blur = () => {
    this.setState({
      placeholder: 'Search'
    });
  };

  onFocus = () => {
    this.setState({
      queryString: '',
      _searchResults: null
    });
  };

  content() {
    return (
      <div className="navHeader">
        <div>
          <div>
            <span className="headerPageProfile">
            {/* <a href="/#/home"><span className="form_container_text_link">Home</span></a> */}
             <span className="headerPageButtons" href="/" onClick={sessionUtils.logout}>
                Logout
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <>
        <div className="header_background carpet">
          {this.content()}
        </div>
      </>
    );
  }
}

export default Header;
