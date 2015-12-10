import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducers/reducer.js';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// export const store = createStoreWithMiddleware(reducer);
export const store = applyMiddleware(thunk)(createStore)(reducer);

store.dispatch({type:'blabla'}); // initialize the state
