import binance from '../../binance';
import rootLogger from '../../logger';
import sentry from '../../sentry';

const logger = rootLogger.child({ module: 'agenda' });

module.exports = (agenda) => {
  agenda.define('buy-crypto', async (job) => {
    try {
      const { data } = job.attrs;
      logger.info({ data }, `> Running Job: ${data.jobName}`);
      await binance.order({
        symbol: data.symbol,
        side: 'BUY',
        type: 'MARKET',
        newOrderRespType: 'FULL',
        quoteOrderQty: data.amount,
      });
    // save order to db with with a ref field(jobId)
    // send notification message
    } catch (err) {
      logger.error({ err });
      sentry.captureException(err);
    }
  });
};
