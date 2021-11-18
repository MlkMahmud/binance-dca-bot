import { Schema, model } from 'mongoose';

const {
  SLACK_ENABLED,
  SLACK_WEBHOOK_URL = '',
  TELEGRAM_BOT_TOKEN = '',
  TELEGRAM_CHAT_ID = '',
  TELEGRAM_ENABLED,
  TIME_ZONE = '',
} = process.env;

export default model(
  'User',
  new Schema({
    password: {
      enabled: { type: Boolean, default: false },
      hash: { type: String, default: '' },
    },

    slack: {
      enabled: { type: Boolean, default: SLACK_ENABLED === 'true' },
      url: { type: String, default: SLACK_WEBHOOK_URL },
    },

    telegram: {
      botToken: { type: String, defualt: TELEGRAM_BOT_TOKEN },
      chatId: { type: String, default: TELEGRAM_CHAT_ID },
      enabled: { type: Boolean, default: TELEGRAM_ENABLED === 'true' },
    },

    timezone: {
      type: String,
      default: TIME_ZONE,
    },
  }),
);
