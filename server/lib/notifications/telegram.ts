import fetch from 'cross-fetch';
import markdownEscape from 'markdown-escape';
import BaseError from '../../error';
import { User } from '../../models';
import rootLogger from '../logger';
import sentry from '../sentry';
import { Event, JobEventPayload } from '.';

function generateMessageText(event: Event, job: JobEventPayload) {
  let text;
  switch (event) {
    case 'success':
      text = `*Job Success*\n_${job.transactTime}_\n\n\n*Job Name:* ${job.name}\n\n*Status:* ${job.status}\n\n*Original Quantity:* ${job.origQty}\n\n*Executed Quantity:* ${job.executedQty}\n\n*Cummulative Quote Quantity:* ${job.cummulativeQuoteQty}\n\n*NextRunAt:* ${job.nextRunAt}`;
      break;
    case 'error':
      text = `*Job Error*\n_${job.date}_\n\n\n*Job Name:* ${
        job.name
      }\n\n*Reason:* ${markdownEscape(job.reason as string)}`;
      break;
    default:
      throw new BaseError('TelegramError', `Invalid event ${event}`);
  }
  return text;
}

export default {
  async sendMessage(event: Event, job: JobEventPayload) {
    const logger = rootLogger.child({ module: 'telegram' });
    try {
      const { telegram } = await User.findOne();
      if (telegram.enabled) {
        logger.info({ job }, `Sending ${event} notification`);
        const text = generateMessageText(event, job);
        const response = await fetch(
          `https://api.telegram.org/bot${telegram.botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegram.chatId,
              parse_mode: 'markdown',
              text,
            }),
          }
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
