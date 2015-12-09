import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import store from '../../store/store.js'
import reducer from '../reducer';

describe('buyReducer', () => {

  const initialState = fromJS({
    matches: [{
      title: 'The Match',
      matchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        availableCash: '1000000'
      },
      userId: '123'
    }]
  });


  it('handles BUY_STOCK for valid trade for a stock that isn\'t held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '10',
      price: '100'
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        title: 'The Match',
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: '789',
            shares: '10'
          }],
          totalValue: '1000000',
          availableCash: '999000'
        },
        userId: '123'
      }]
    );
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '10',
      price: '100'
    };
    const middleState = reducer(initialState, action);
    const nextState = reducer(middleState, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        title: 'The Match',
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '20'
          }],
          totalValue: '1000000',
          availableCash: '998000'
        },
        userId: '123'
      }]
    );
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held and another stock is held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '10',
      price: '100'
    };

    const action2 = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'FB',
      shares: '10',
      price: '100'
    };

    const state1 = reducer(initialState, action);
    const state2 = reducer(state1, action2);    
    const nextState = reducer(state2, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        title: 'The Match',
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '20'
          },
          {
            stockSymbol: 'FB',
            shares: '10'
          }],
          totalValue: '1000000',
          availableCash: '997000'
        },
        userId: '123'
      }]
    );
  });

  it('does not update state for BUY_STOCK with invalid trade', () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '10000000',
      price: '10'
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(initialState);
  });

});

describe('sellReducer', () => {

  const initialState = fromJS({
    matches: [{
      title: 'The Match',
      matchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        availableCash: '1000000'
      },
      userId: '123'
    }]
  });
  
  it('handles SELL_STOCK for valid trade', () => {
    //need to have initial state include a stock so we can execute a valid trade
    const actionBuy = {
      type: 'BUY_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '100',
      price: '10'
    };

    const actionSell = {
      type: 'SELL_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '100',
      price: '10'
    };
    const nextState = reducer(initialState, actionBuy);
    const finalState = reducer(nextState, actionSell);

    expect(finalState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        title: 'The Match',
        matchId: '456',
        portfolio: {
          stocks: [],
          totalValue: '1000000',
          availableCash: '1000000'
        },
        userId: '123'
      }]
    );
  });

  it('does not update state for SELL_STOCK with invalid trade', () => {
    const action = {
      type: 'SELL_STOCK',
      userId: '123',
      matchId: '456',
      stockSymbol: 'GOOG',
      shares: '100',
      price: '10'
    };
    const nextState = reducer(initialState, action);

    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        title: 'The Match',
        matchId: '456',
        portfolio: {
          stocks: [],
          totalValue: '1000000',
          availableCash: '1000000'
        },
        userId: '123'
      }]
    );
  });

});

describe('general reducer', () => {

  const initialState = fromJS({
    matches: [{
      title: 'The Match',
      matchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        availableCash: '1000000'
      },
      userId: '123'
    }]
  });

  it('handles unknown action type', () => {
    const initialState = Map();
    const action = {
      type: 'EAT_PANCAKES'
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(initialState);

  });

});
