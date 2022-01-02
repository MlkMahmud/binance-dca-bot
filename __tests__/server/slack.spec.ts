// @ts-nocheck
jest.mock('cross-fetch');
import fetch from 'cross-fetch';
import BaseError from '../../server/error';
import slack from '../../server/lib/notifications/slack';
import sentry from '../../server/lib/sentry';
import { User } from '../../server/models';
import { errorPayload, successPayload } from '../../__mocks__/data';
import database from '../../__mocks__/database';

const slackUrl = 'https://slack-webhook.com';

fetch.mockImplementation(() =>
  Promise.resolve(new Response(null, { status: 200 }))
);

beforeAll(async () => {
  await database.connect();
});

beforeEach(async () => {
  await User.create({
    slack: {
      enabled: true,
      url: slackUrl,
    },
  });
});

afterEach(async () => {
  jest.restoreAllMocks();
  fetch.mockClear();
  await database.flush();
});

afterAll(async () => {
  await database.disconnnect();
});

describe('slack', () => {
  it('should send a success notification', async () => {
    await slack.sendMessage('success', successPayload);
    expect(fetch).toHaveBeenCalledWith(slackUrl, {
      body: JSON.stringify({
        blocks: [
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
                text: '23 Dec 2021, 23:00:00 West Africa Standard Time',
                type: 'mrkdwn',
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*Job Name:*\nBNB Daily',
              },
              {
                type: 'mrkdwn',
                text: '*Status:*\nFILLED',
              },
              {
                type: 'mrkdwn',
                text: '*Original Quantity:*\n0.06000000',
              },
              {
                type: 'mrkdwn',
                text: '*Executed Quantity:*\n0.06000000',
              },
              {
                type: 'mrkdwn',
                text: '*Cummulative Quote Quantity:*\n42.18000000',
              },
              {
                type: 'mrkdwn',
                text: '*NextRunAt:*\n24 Dec 2021, 23:00:00 West Africa Standard Time',
              },
            ],
          },
        ],
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  });

  it('should send an error notification message', async () => {
    await slack.sendMessage('error', errorPayload);
    expect(fetch).toHaveBeenCalledWith(slackUrl, {
      body: JSON.stringify({
        blocks: [
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
                text: '23 Dec 2021, 23:00:00 West Africa Standard Time',
                type: 'mrkdwn',
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*Job Name:*\nBNB Daily',
              },
              {
                type: 'mrkdwn',
                text: '*Reason:*\nInsufficient funds',
              },
            ],
          },
        ],
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  });

  it('should not send a notification if slack is disabled', async () => {
    await User.findOneAndUpdate({}, { $set: { 'slack.enabled': false } });
    await slack.sendMessage('error', errorPayload);
    await slack.sendMessage('success', successPayload);
    expect(fetch).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if event is invalid', async () => {
    const captureException = jest.spyOn(sentry, 'captureException');
    const event = 'invalid';
    await slack.sendMessage(event, successPayload);
    expect(captureException).toHaveBeenCalledWith(
      new BaseError('SlackError', `Invalid event: ${event}`)
    );
  });

  it('should handle a slack API error response', async () => {
    const captureException = jest.spyOn(sentry, 'captureException');
    const errorMessage = 'network error';
    fetch.mockReturnValueOnce(new Response(errorMessage, { status: 400 }));
    await slack.sendMessage('success', successPayload);
    expect(captureException).toHaveBeenCalledWith(
      new BaseError('SlackError', errorMessage)
    );
  });
});
