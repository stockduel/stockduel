'use strict';

import React from 'react';
import { render } from 'react-dom';
import { store } from '../store/store.js';
import { Provider } from 'react-redux';
import { IndexRoute } from 'react-router';
import { AppConnected } from '../Components/app.jsx';
import { PortfolioConnected } from '../Components/portfolio.jsx';
import { Home } from '../Components/home.jsx';
import { StateGenConnected } from '../Components/stateGen.jsx';
import { MatchesConnected } from '../Components/matches.jsx';
import { JoinMatchConnected } from '../Components/joinMatch.jsx';
import { SearchStocks } from '../Components/searchStocks.jsx';

// import { buy } from '../actions/actions.js';
import { toJS } from 'immutable';
import { Router, Route, Link } from 'react-router';

var AppWithStore = React.createClass({

  render() {
    return (
      <Provider store={store}>
      <div>
        <AppConnected />
          {this.props.children}
      </div>
      </Provider>
    );
  }
});
render ((
    <Router>
      <Route path="/" component={AppWithStore}>
        <IndexRoute component={Home} />
        <Route path="_=_" component={StateGenConnected} />
        <Route path="matches" component={MatchesConnected} />
        <Route path="portfolio" component={PortfolioConnected} />
        <Route path="join" component={JoinMatchConnected} />
        <Route path="search" component={SearchStocks} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
);
