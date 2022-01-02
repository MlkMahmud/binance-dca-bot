import fetch from 'cross-fetch';
import { Event, JobEventPayload } from '.';
import BaseError from '../../error';
import { User } from '../../models';
import rootLogger from '../logger';
import sentry from '../sentry';

function generateMessage(event: Event, job: JobEventPayload) {
  const message: { blocks: Array<any> } = { blocks: [] };
  switch (event) {
    case 'success':
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Job Success :white_check_mark:',
          },
        },
        {
          type: 'context',
          elements: [
            {
              text: job.transactTime,
              type: 'mrkdwn',
            },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Job Name:*\n${job.name}` },
            { type: 'mrkdwn', text: `*Status:*\n${job.status}` },
            { type: 'mrkdwn', text: `*Original Quantity:*\n${job.origQty}` },
            {
              type: 'mrkdwn',
              text: `*Executed Quantity:*\n${job.executedQty}`,
            },
            {
              type: 'mrkdwn',
              text: `*Cummulative Quote Quantity:*\n${job.cummulativeQuoteQty}`,
            },
            { type: 'mrkdwn', text: `*NextRunAt:*\n${job.nextRunAt}` },
          ],
        }
      );
      break;
    case 'error':
      message.blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Job Error :x:',
          },
        },
        {
          type: 'context',
          elements: [
            {
              text: job.date,
              type: 'mrkdwn',
            },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Job Name:*\n${job.name}` },
            { type: 'mrkdwn', text: `*Reason:*\n${job.reason}` },
          ],
        }
      );
      break;
    default:
      throw new BaseError('SlackError', `Invalid event: ${event}`);
  }
  return message;
}

export default {
  async sendMessage(event: Event, job: JobEventPayload) {
    const logger = rootLogger.child({ module: 'slack' });
    try {
      const { slack } = await User.findOne();
      if (slack.enabled) {
        logger.info({ job }, `Sending ${event} notification`);
        const message = generateMessage(event, job);
        const response = await fetch(slack.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(message),
        });

        if (response.ok) logger.info(`${event} notification sent successfully`);
        else {
          const errorMessage = await response.text();
          throw new BaseError('SlackError', errorMessage);
        }
      }
    } catch (err) {
      logger.error({ err });
      sentry.captureException(err);
    }
  },
};
