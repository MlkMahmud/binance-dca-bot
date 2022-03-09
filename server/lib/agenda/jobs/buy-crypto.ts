import { Agenda, Job } from 'agenda';
import mongoose from 'mongoose';
import binance from '../../binance';
import notifications from '../../notifications';
import rootLogger from '../../logger';
import sentry from '../../sentry';
import { Order } from '../../../models';
import { formatDateString } from '../../../utils';

const logger = rootLogger.child({ module: 'agenda' });

module.exports = (agenda: Agenda) => {
  agenda.define('buy-crypto', async (job: Job) => {
    const { _id, data, nextRunAt, repeatTimezone } = job.attrs;
    try {
      if (data?.paused) {
        logger.info({ data }, `> Skipping paused job: ${data?.jobName}`);
      } else {
        logger.info({ data }, `> Running Job: ${data?.jobName}`);
        const order = await binance.order({
          symbol: data?.symbol,
          side: 'BUY',
          // @ts-ignore
          type: 'MARKET',
          newOrderRespType: 'FULL',
          quoteOrderQty: data?.amount,
        });
        logger.info({ data }, `> Job: ${data?.jobName} ran successfully`);
        Order.create({ jobId: _id, ...order });
        notifications.sendMessage('success', {
          cummulativeQuoteQty: order.cummulativeQuoteQty,
          executedQty: order.executedQty,
          name: data?.jobName,
          nextRunAt: formatDateString(new Date(nextRunAt || ''), {
            timeZone: repeatTimezone,
          }),
          origQty: order.origQty,
          status: order.status,
          transactTime: formatDateString(new Date(order.transactTime || ''), {
            timeZone: repeatTimezone,
          }),
        });
      }
    } catch (err: any) {
      logger.error({ err });
      sentry.captureException(err);
      if (!(err instanceof mongoose.Error)) {
        notifications.sendMessage('error', {
          date: formatDateString(new Date(), { timeZone: repeatTimezone }),
          name: data?.jobName,
          reason: err.message,
        });
      }
    }
  });
};
