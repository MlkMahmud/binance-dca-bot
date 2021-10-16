/* eslint-disable lines-between-class-members */
import fetch from 'cross-fetch';
import sentry from './sentry';

class Telegram {
  chatId = process.env.TELEGRAM_CHAT_ID;
  url = `https://api.telegram.org${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  async sendMessage(text) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: this.chatId, text }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.description);
      }
    } catch (err) {
      sentry.captureException(err);
    }
  }
}

export default new Telegram();
