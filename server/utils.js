import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
import moment from 'moment-timezone';
import Joi, { ValidationError } from 'joi';
import binance from './lib/binance';

export function cleanUserObject({
  password, slack, telegram, timezone,
}) {
  return {
    password: {
      enabled: password.enabled,
      isSet: password.hash.length > 0,
    },
    slack,
    telegram,
    timezone,
  };
}

// Joi validation functions

export function validateTimezone(tz, helper) {
  const timezone = moment.tz.zone(tz);
  if (!timezone) {
    return helper.message(`Timezone ${tz} is invalid`);
  }
  return timezone.name;
}

function validateCronSyntax(schedule, helper) {
  try {
    parseExpression(schedule);
    cronstrue.toString(schedule);
    return schedule;
  } catch {
    return helper.message(`Cron syntax ${schedule} is invalid`);
  }
}

export function formatDateString(date, options = {}) {
  return date.toLocaleString('en-US', {
    day: '2-digit',
    hour: '2-digit',
    year: 'numeric',
    month: 'short',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'long',
    ...options,
  });
}

export async function validateJobConfig(config, mode = 'required') {
  const schema = Joi.object({
    amount: Joi.number().presence(mode),
    enable: Joi.bool(),
    disable: Joi.bool(),
    name: Joi.string().presence(mode),
    schedule: Joi.string().presence(mode).custom(validateCronSyntax),
    symbol: Joi.string().presence(mode).external(async (value) => {
      if (mode === 'required') {
        try {
          await binance.exchangeInfo({ symbol: value });
        } catch {
          throw new ValidationError('', [{ message: `Failed to validate symbol: ${value}` }]);
        }
      }
    }),
    timezone: Joi.string().presence(mode).custom(validateTimezone),
    quoteAsset: Joi.string().presence(mode).custom((value, helpers) => {
      if (config.symbol.endsWith(value)) {
        return value;
      }
      return helpers.message(`${value} is an invalid asset.`);
    }),
    useDefaultTimezone: Joi.bool().presence(mode),
  })
    .oxor('enable', 'disable')
    .messages({
      'object.oxor': "You can specify either 'enable' or 'disable' not both.",
    });
  const validatedConfig = await schema.validateAsync(config);
  return validatedConfig;
}

export function handleJoiValidationError(err) {
  if (err instanceof ValidationError) {
    const [{ message }] = err.details;
    return { status: 400, message };
  }
  throw err;
}

export function flattenObject(object = {}) {
  const document = {};
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = object[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenObject(value);
      const nestedKeys = Object.keys(nested);
      for (let n = 0; n < nestedKeys.length; n += 1) {
        const nestedKey = nestedKeys[n];
        document[`${key}.${nestedKey}`] = nested[nestedKey];
      }
    } else {
      document[key] = value;
    }
  }
  return document;
}
