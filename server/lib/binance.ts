import Binance from 'binance-api-node';

const config: any = {
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
};

if (process.env.NODE_ENV !== 'production') {
  config.httpBase = 'https://testnet.binance.vision';
}

export default Binance(config);
