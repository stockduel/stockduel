import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {store} from '../../store/store.js'
import reducer from '../../reducers/reducer';
import {buy, sell} from '../actions'

describe('buy action', () => {

  it('handles BUY_STOCK for valid trade for a stock that isn\'t held' , () => {
    const action = buy({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '10',
      price: '100',
      action: 'buy'
    });
    store.dispatch(action);
    const nextState = store.getState();
    expect(nextState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '999000'
        },
      }]
    );

  });

  it('handles BUY_STOCK for valid trade for a stock that is already held' , () => {
    const action = buy({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '10',
      price: '100',
      action: 'buy'
    });

    store.dispatch(action);
    store.dispatch(action);
    const nextState = store.getState();
    expect(nextState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '30',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '997000'
        }
      }]
    );
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held and another stock is held' , () => {
    const action = buy({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '10',
      price: '100',
      action: 'buy'
    });

    const action2 = buy({
      userId: '123',
      matchId: '456',
      stockTicker: 'FB',
      numShares: '10',
      price: '100',
      action: 'buy'
    });

    store.dispatch(action);
    store.dispatch(action2);    
    store.dispatch(action);
    const nextState = store.getState();
    expect(nextState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '50',
            price: '100'
          },
          {
            stockSymbol: 'FB',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '994000'
        }
      }]
    );
  });

  it('does not update state for BUY_STOCK with invalid trade', () => {
    const action = buy({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '10000000',
      price: '10',
      action: 'buy'
    });
    store.dispatch(action);
    const nextState = store.getState();

    expect(nextState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '50',
            price: '100'
          },
          {
            stockSymbol: 'FB',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '994000'
        }
      }]
    );
  });

});

describe('sell action', () => {

  it('handles SELL_STOCK for valid trade', () => {
    const actionSell = sell({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '100',
      price: '10',
      action: 'sell'
    });

    store.dispatch(actionSell);
    const finalState = store.getState();

    expect(finalState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '50',
            price: '100'
          },
          {
            stockSymbol: 'FB',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '994000'
        }
      }]
    );
  });

  it('does not update state for SELL_STOCK with invalid trade', () => {
    const action = sell({
      userId: '123',
      matchId: '456',
      stockTicker: 'GOOG',
      numShares: '100',
      price: '10',
      action: 'sell'
    });
    store.dispatch(action);
    const nextState = store.getState();

    expect(nextState.get('matches').toJS()).to.deep.equal(
      [{
        matchId: '456',
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '50',
            price: '100'
          },
          {
            stockSymbol: 'FB',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '994000'
        }
      }]
    );
  });

});
