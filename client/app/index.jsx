'use strict';

import React from 'react';
import { render } from 'react-dom';

// hot swap css
import stylesheet from '../assets/stylesheets/style.css'

var App = React.createClass({

  render() {
    return <h1>Hello World!</h1>;
  },

});

render (
  <App />,
  document.getElementById('app')
);
