import fetch from 'cross-fetch';
import { generateSelectOption } from '../../utils';

export default {
  async fetchSymbols(query) {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const options = [];
    const { symbols } = await response.json();
    symbols.forEach(({ symbol, isSpotTradingAllowed }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        const option = generateSelectOption(symbol);
        options.push(option);
      }
    });
    return options;
  },
};
