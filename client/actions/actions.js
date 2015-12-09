export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';

export function buy(options) {
  return {
    type: BUY_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockSymbol: options.stockSymbol,
    price: options.price,
    shares: options.shares
  }
}

export function sell(options) {
  return {
    type: SELL_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockSymbol: options.stockSymbol,
    price: options.price,
    shares: options.shares
  }
}
