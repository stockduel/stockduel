export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';

export function buy(options) {
  return {
    type: BUY_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockId: options.stockId,
    price: options.price,
    shares: options.shares
  }
}

export function sell() {
  return {
    type: SELL_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockId: options.stockId,
    price: options.price,
    shares: options.shares
  }
}