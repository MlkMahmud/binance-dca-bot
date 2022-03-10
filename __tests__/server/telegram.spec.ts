// @ts-nocheck
jest.mock('cross-fetch');
import fetch from 'cross-fetch';
import BaseError from '../../server/error';
import telegram from '../../server/lib/notifications/telegram';
import sentry from '../../server/lib/sentry';
import { User } from '../../server/models';
import { errorPayload, successPayload } from '../../__mocks__/data';
import database from '../../__mocks__/database';

const botToken = 'token';
const chatId = '12345';

fetch.mockImplementation(() =>
  Promise.resolve(new Response(null, { status: 200 }))
);

beforeAll(async () => {
  await database.connect();
});

beforeEach(async () => {
  await User.create({
    telegram: {
      botToken,
      chatId,
      enabled: true,
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

describe('telegram', () => {
  it('should send a success notification', async () => {
    await telegram.sendMessage('success', successPayload);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: 'markdown',
          text: '*Job Success*\n_23 Dec 2021, 23:00:00 West Africa Standard Time_\n\n\n*Job Name:* BNB Daily\n\n*Status:* FILLED\n\n*Original Quantity:* 0.06000000\n\n*Executed Quantity:* 0.06000000\n\n*Cummulative Quote Quantity:* 42.18000000\n\n*NextRunAt:* 24 Dec 2021, 23:00:00 West Africa Standard Time',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }
    );
  });

  it('should send an error notfification', async () => {
    await telegram.sendMessage('error', errorPayload);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: 'markdown',
          text: '*Job Error*\n_23 Dec 2021, 23:00:00 West Africa Standard Time_\n\n\n*Job Name:* BNB Daily\n\n*Reason:* Insufficient funds',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      }
    );
  });

  it('should not send a notification if telegram is disabled', async () => {
    await User.findOneAndUpdate(
      {},
      {
        $set: { 'telegram.enabled': false },
      }
    );
    await telegram.sendMessage('success', successPayload);
    await telegram.sendMessage('error', errorPayload);
    expect(fetch).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if event is invalid', async () => {
    const captureException = jest.spyOn(sentry, 'captureException');
    const event = 'invalid';
    await telegram.sendMessage(event, successPayload);
    expect(captureException).toHaveBeenCalledWith(
      new BaseError('TelegramError', `Invalid event ${event}`)
    );
  });

  it('should handle a telegram API error response', async () => {
    const captureException = jest.spyOn(sentry, 'captureException');
    const errorMessage = 'chatId is invalid';
    fetch.mockReturnValueOnce(
      new Response(JSON.stringify({ description: errorMessage }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    );
    await telegram.sendMessage('success', successPayload);
    expect(captureException).toHaveBeenCalledWith(
      new BaseError('TelegramError', errorMessage)
    );
  });
});
