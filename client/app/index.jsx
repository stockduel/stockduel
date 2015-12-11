'use strict';

import React from 'react';
import { render } from 'react-dom';
import { store } from '../store/store.js';
import { Provider } from 'react-redux';
import { PortfolioConnected } from '../Components/portfolio.jsx';
// import { buy } from '../actions/actions.js';
import { toJS } from 'immutable';

// hot swap css
import stylesheet from '../assets/stylesheets/style.css'
var App = React.createClass({

  render() {
    return (
      <div>
        <h1>This. Is. Stockduel.</h1>
        <PortfolioConnected />
      </div>
    )
  },

});
render (
  <Provider store={store}>
    <App />
  </Provider>,
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
