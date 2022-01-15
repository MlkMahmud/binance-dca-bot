import Binance from 'binance-api-node';

const config: any = {
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  httpBase: 'https://testnet.binance.vision',
};

if (process.env.BINANCE_TESTNET_ENABLED === 'false') {
  config.httpBase = 'https://api.binance.com';
}

export default Binance(config);
