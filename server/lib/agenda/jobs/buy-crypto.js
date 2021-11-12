import binance from '../../binance';
import rootLogger from '../../logger';
import sentry from '../../sentry';
import { Order } from '../../../models';

const logger = rootLogger.child({ module: 'agenda' });

module.exports = (agenda) => {
  agenda.define('buy-crypto', async (job) => {
    try {
      const { data } = job.attrs;
      logger.info({ data }, `> Running Job: ${data.jobName}`);
      const order = await binance.order({
        symbol: data.symbol,
        side: 'BUY',
        type: 'MARKET',
        newOrderRespType: 'FULL',
        quoteOrderQty: data.amount,
      });
      await Order.create(order);
    // send notification message
    } catch (err) {
      logger.error({ err });
      sentry.captureException(err);
    }
  });
};
