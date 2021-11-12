import Joi, { ValidationError } from 'joi';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import agenda from './lib/agenda';
import binance from './lib/binance';
import { User } from './models';
import timezones from './timezones.json';
import {
  cleanUserObject,
  validateCronSyntax,
  validateTimezone,
} from './utils';

export default {
  fetchTimezones(query = '') {
    const tzs = [];
    timezones.forEach((timezone) => {
      if (timezone.toLowerCase().includes(query.toLowerCase())) {
        tzs.push({ label: timezone, value: timezone });
      }
    });
    return tzs;
  },
  async fetchSymbols(query = '') {
    const { symbols } = await binance.exchangeInfo();
    const options = [];
    symbols.forEach(({
      filters, isSpotTradingAllowed, quoteAsset, symbol,
    }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        const { minNotional } = filters.find(({ filterType }) => filterType === 'MIN_NOTIONAL');
        options.push({
          symbol,
          minNotional: Number(minNotional),
          quoteAsset,
        });
      }
    });
    return options;
  },

  async fetchAccountBalance() {
    const { balances } = await binance.accountInfo();
    return balances.map((balance) => ({
      ...balance,
      total: Number(balance.free) + Number(balance.locked),
    }));
  },

  async setPassword(data) {
    try {
      const user = await User.findOne();
      if (user.password.hash) {
        return { status: 403, message: 'Password already exists.' };
      }
      const { password } = await Joi.object({
        password: Joi.string().min(8).required().label('Password'),
        confirmPassword: Joi.any()
          .equal(Joi.ref('password'))
          .required()
          .label('Confirm password')
          .options({
            messages: { 'any.only': '{{#label}} does not match password' },
          }),
      }).validateAsync(data);
      await User.findOneAndUpdate(
        {},
        { password: { enabled: true, hash: hashSync(password, 10) } },
      );
      return {
        status: 201,
        message: 'Password successfully enabled',
      };
    } catch (e) {
      if (e instanceof ValidationError) {
        const [{ message }] = e.details;
        return { status: 400, message };
      }
      throw e;
    }
  },

  async updatePassword({ action, password = '', newPassword }) {
    try {
      const {
        password: { hash },
      } = await User.findOne();

      if (!hash) {
        return { status: 403, message: 'Password has not been set yet.' };
      }

      if (!compareSync(password, hash)) {
        return { status: 403, message: 'Password is incorrect' };
      }

      if (action === 'enable') {
        await User.findOneAndUpdate({}, { $set: { 'password.enabled': true } });
        return { status: 200, message: 'Password sucessfully enabled' };
      }

      if (action === 'disable') {
        await User.findOneAndUpdate({}, { $set: { 'password.enabled': false } });
        return { status: 200, message: 'Password sucessfully disabled' };
      }

      if (action === 'update') {
        await Joi
          .object({
            newPassword: Joi.string().min(8).required(),
          }).validateAsync({ newPassword });
        if (password === newPassword) {
          return { status: 400, message: 'new password cannot be the same as the old.' };
        }
        await User.findOneAndUpdate(
          {},
          { $set: { 'password.hash': hashSync(newPassword, 10) } },
        );
        return { status: 200, message: 'Password sucessfully updated' };
      }
      return { status: 400, message: 'Invalid action' };
    } catch (e) {
      if (e instanceof ValidationError) {
        const [{ message }] = e.details;
        return { status: 400, message };
      }
      throw e;
    }
  },

  async loginUser(password) {
    const user = await User.findOne();
    if (compareSync(password, user.password.hash)) {
      // This is a single user system.
      // so it seems pointless to encode any unique attribute in the jwt payload
      const accessToken = jwt.sign({}, process.env.JWT_SECRET);
      return { status: 200, accessToken, message: 'success' };
    }
    return { status: 403, message: 'password is incorrect' };
  },

  async updateSettings(payload) {
    try {
      const data = await Joi.object({
        slack: Joi.object({ enabled: Joi.bool(), url: Joi.string().uri() }),
        telegram: Joi.object({ enabled: Joi.bool(), botToken: Joi.string(), chatId: Joi.string() }),
        timezone: Joi.string().custom(validateTimezone),
      }).validateAsync(payload);
      const userObject = await User.findOneAndUpdate({}, data, { new: true });
      return { status: 200, user: cleanUserObject(userObject) };
    } catch (e) {
      if (e instanceof ValidationError) {
        const [{ message }] = e.details;
        return { status: 400, message };
      }
      throw e;
    }
  },

  async fetchAllJobs() {
    const jobs = await agenda.jobs({});
    return jobs;
  },

  async createJob(config) {
    try {
      const {
        amount,
        name: jobName,
        schedule,
        quoteAsset,
        symbol,
        timezone,
        useDefaultTimezone,
      } = await Joi.object({
        amount: Joi.number().required(),
        name: Joi.string().required(),
        schedule: Joi.string().required().custom(validateCronSyntax),
        symbol: Joi.string().required().external(async (value) => {
          try {
            await binance.exchangeInfo({ symbol: value });
            return value;
          } catch {
            throw new ValidationError('', [{ message: `Failed to validate symbol: ${value}` }]);
          }
        }),
        timezone: Joi.string().required().custom(validateTimezone),
        quoteAsset: Joi.string().required().custom((value, helpers) => {
          if (config.symbol.endsWith(value)) {
            return value;
          }
          return helpers.message(`${value} is an invalid asset.`);
        }),
        useDefaultTimezone: Joi.bool().required(),
      }).validateAsync(config);
      const job = agenda.create('buy-crypto', {
        amount,
        jobName,
        quoteAsset,
        symbol,
        useDefaultTimezone,
      });
      job.repeatEvery(schedule, {
        skipImmediate: true,
        timezone,
      });
      job.save();
      return { status: 200, job: job.toJSON() };
    } catch (e) {
      if (e instanceof ValidationError) {
        const [{ message }] = e.details;
        return { status: 400, message };
      }
      throw e;
    }
  },
};
