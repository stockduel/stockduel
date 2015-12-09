import React from 'react';
import requestMiddleware from 'redux-request';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';


//THIS FILE DOES NOT WORK YET


const createStoreWithMiddleware = applyMiddleware(requestMiddleware)(createStore);

const store = createStoreWithMiddleware(reducer);
