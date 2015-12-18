'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions.js';
// import request from 'superagent';

export const Home = React.createClass({
  // componentWillMount() {
    // this.props.updatePrices(this.props.portfolio.get('stocks'));
  // },
  render() {
    return (
      <div>
        <h2>StockDuel: Fantasy Stock-Trading for Pirates</h2>
        <p>Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crows nest 
        nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon starboard grog black jack gangway rutters.</p>
        <p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her 
        cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul 
        squiffy black spot yardarm spyglass sheet transom heave to.</p>
        <p>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup 
        ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom 
        spirits.</p>
        <p>Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crows nest 
        nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon starboard grog black jack gangway rutters.</p>
        <p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her 
        cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul 
        squiffy black spot yardarm spyglass sheet transom heave to.</p>
        <p>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup 
        ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom 
        spirits.</p>
      </div>
    );
  }

});
