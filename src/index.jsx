import React from 'react';
import ReactDOM from 'react-dom';
import {Map} from 'immutable';
import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {setState} from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/App';
import {VotingContainer} from './components/Voting';
import {ResultsContainer} from './components/Results';

const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state =>
  store.dispatch(setState(state))
);

// Apply middleware/ Redux DevTools extention to the store
const store = createStore(reducer, Map(), compose(
  applyMiddleware(remoteActionMiddleware(socket)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const routes = <Route component={App}>
  <Route path="/results" component={ResultsContainer} />
  <Route path="/" component={VotingContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
