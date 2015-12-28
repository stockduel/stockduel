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
import {CreateMatch} from '../Components/createMatch.jsx';
import {JoinMatch} from '../Components/joinMatch.jsx';

// import { buy } from '../actions/actions.js';
import { toJS } from 'immutable';
import { Router, Route, Link } from 'react-router';

// hot swap css
import stylesheet from '../assets/stylesheets/style.css';

// dummy component for testing
// var Dummy = React.createClass({
//   render() {
//     return (
//       <div>
//         <h1>Dummy Page</h1>
//         <Link to="/home">to app page</Link>
//       </div>
//     );
//   }
// })

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
        <Route path="create" component={CreateMatch} />
        <Route path="matches" component={MatchesConnected} />
        <Route path="portfolio" component={PortfolioConnected} />
        <Route path="join" component={JoinMatch} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
);


// Used to test whether stocks would render on the page. Should be deleted when we're comfortable that things work

// function dispatchBuy() {
//   store.dispatch(buy({
//       userId: '123',
//       matchId: '456',
//       stockSymbol: 'GOOG',
//       shares: '10',
//       price: '100'
//     }));
// }
// setTimeout(dispatchBuy, 1000);
