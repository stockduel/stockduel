import React from 'react';
//require thunk to allow for ajax calls within actions
import thunk from 'redux-thunk';
//require createStore and applyMiddleware for generating the redux store
import {createStore, applyMiddleware} from 'redux';
//require master reducer file for store creation
import reducer from '../reducers/reducer.js';

//declare store with thunk middleware and reducer passed in
export const store = applyMiddleware(thunk)(createStore)(reducer);