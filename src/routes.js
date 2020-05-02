import React from 'react';
import Loadable from 'react-loadable';
import LoadingIcon from '../src/assets/img/brand/loading.gif';
import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <img src={LoadingIcon} className="loading" alt="description" />;
}

const HomePage = Loadable({
  loader: () => import('./containers/Home'),
  loading: Loading
});

const GamePage = Loadable({
  loader: () => import('./containers/Game'),
  loading: Loading
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/home', name: 'homePage', component: HomePage },
  { path: '/game', name: 'gamePage', component: GamePage },
];

export default routes;
