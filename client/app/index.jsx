'use strict';

import React from 'react';
import { render } from 'react-dom';
import { store } from '../store/store.js';
import { Provider } from 'react-redux';
import { AppConnected } from '../Components/app.jsx';
import { PortfolioConnected } from '../Components/portfolio.jsx';
import { Home } from '../Components/home.jsx';
import { StateGenConnected } from '../Components/stateGen.jsx';
// import { buy } from '../actions/actions.js';
import { toJS } from 'immutable';
import { Router, Route, Link } from 'react-router';

// hot swap css
import stylesheet from '../assets/stylesheets/style.css';


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
        <Route path="home" component={Home} />
        <Route path="portfolio" component={PortfolioConnected} />
        <Route path="_=_" component={StateGenConnected} />
      </Route>
    </Router>
  ),
  document.body
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
