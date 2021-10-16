import binance from './lib/binance';
import { generateSelectOption } from '../utils';

export default {
  async fetchSymbols(query = '') {
    const { symbols } = await binance.exchangeInfo();
    const options = [];
    symbols.forEach(({ isSpotTradingAllowed, symbol }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        options.push(generateSelectOption(symbol));
      }
    });
    return options;
  },

  async fetchAccountBalance() {
    const { balances } = await binance.accountInfo();
    return balances.map((balance) => ({
      ...balance,
      total: Number(balance.free) + Number(balance.locked),
    }));
  },
};
