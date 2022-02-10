// Styles
// CoreUI Icons Set
import '@coreui/icons/css/all.min.css'
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css'
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css'
import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Callback from './views/Callback'
import SecuredRoute from './utils/SecuredRoute'
import Loadable from 'react-loadable'
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css'
import LoadingIcon from './assets/img/brand/loading.gif'
// Import Main styles for this application
import './scss/style.scss'
import { createTheme } from 'react-data-table-component'

function Loading() {
    return <img src={LoadingIcon} className="loading" alt="Loading Icon" />;
}

createTheme('solarized', {
    text: {
        primary: 'white',
        secondary: 'white',
    },
    background: {
        default: '#636f83',
    },
    context: {
        background: '#636f83',
        text: 'white',
    },
    divider: {
        default: '#758297',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: '#636fff',
        disabled: 'rgba(0,0,0,.12)',
    },
})

const HomePage = Loadable({
    loader: () => import('./components/Home/Home'),
    loading: Loading
})

const GamePage = Loadable({
    loader: () => import('./components/Game/Game'),
    loading: Loading
})

class App extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {}

    render() {
        const { match, location, history } = this.props;
        return (
            <div>
                <Route exact path='/callback' component={Callback} />

                <SecuredRoute path="/" exact name="Home" component={HomePage} match={match} location={location} history={history} />
                <SecuredRoute path="/game/:id" exact name="Game" component={GamePage} match={match} location={location} history={history} />
            </div>
        );
    }
}

export default withRouter(App);
