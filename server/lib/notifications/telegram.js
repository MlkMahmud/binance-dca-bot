import fetch from 'cross-fetch';
import BaseError from '../../error';
import { User } from '../../models';
import rootLogger from '../logger';
import sentry from '../sentry';

function generateMessageText(event, job) {
  let text;
  switch (event) {
    case 'success':
      text = `*Job Success*\n_${new Date(job.transactTime)}_\n\n*Job Name: *${job.name}\n*Status: *${job.status}\n*Original Quantity :*${job.origQty}\n*Executed Quantity: *${job.executedQty}\n*Cummulative Quote Quantity: *${job.cummulativeQuoteQty}\n*NextRunAt: *${new Date(job.nextRunAt)}`;
      break;
    case 'error':
      text = `*Job Error*\n_${new Date(job.lastFinishedAt)}_\n\n*Job Name: *${job.name}\n*Reason: *${job.reason}`;
      break;
    default:
      throw new BaseError('TelegramError', `Invalid event ${event}`);
  }
  return text;
}

export default {
  async sendMessage(event, job) {
    const logger = rootLogger.child({ module: 'telegram' });
    try {
      const { telegram } = await User.findOne();
      if (telegram.enabled) {
        logger.info({ job }, `Sending ${event} notification`);
        const text = generateMessageText(event, job);
        const response = await fetch(
          `https://api.telegram.org/${telegram.botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegram.chatId,
              parse_mode: 'markdown',
              text,
            }),
          },
        );
        if (response.ok) logger.info(`${event} notification sent successfully`);
        else {
          const { description } = await response.json();
          throw new BaseError('TelegramError', description);
        }
      }
    } catch (err) {
      logger.error({ err });
      sentry.captureException(err);
    }
  },
};
