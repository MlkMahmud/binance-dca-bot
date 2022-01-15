import { Schema, model, ValidatorProps } from 'mongoose';
import moment from 'moment-timezone';

const {
  SLACK_ENABLED,
  SLACK_WEBHOOK_URL = '',
  TELEGRAM_BOT_TOKEN = '',
  TELEGRAM_CHAT_ID = '',
  TELEGRAM_ENABLED,
  TIMEZONE = '',
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
      default: () => {
        // Allow setting empty string
        if (TIMEZONE) {
          const timezone = moment.tz
            .names()
            .find((name) => name.toLowerCase() === TIMEZONE.toLowerCase());
          if (!timezone) {
            return TIMEZONE;
          }
          return timezone;
        }
        return TIMEZONE;
      },
      type: String,
      validate: {
        message: ({ value }: ValidatorProps) =>
          `${value} is not a valid timezone`,
        validator: function (tz: string) {
          if (tz) {
            return moment.tz.zone(tz) !== null;
          }
          return true;
        },
      },
    },
  })
);
