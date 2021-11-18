import Joi from 'joi';
import { compareSync, hashSync } from 'bcrypt';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';
import agenda from './lib/agenda';
import binance from './lib/binance';
import { User } from './models';

import {
  cleanUserObject,
  flattenObject,
  handleJoiValidationError,
  validateJobConfig,
  validateTimezone,
} from './utils';

export default {
  fetchTimezones(query = '') {
    const tzs = [];
    moment.tz.names().forEach((timezone) => {
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
      const response = handleJoiValidationError(e);
      return response;
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
        await Joi.object({
          newPassword: Joi.string().min(8).required(),
        }).validateAsync({ newPassword });
        if (password === newPassword) {
          return {
            status: 400,
            message: 'new password cannot be the same as the old.',
          };
        }
        await User.findOneAndUpdate(
          {},
          { $set: { 'password.hash': hashSync(newPassword, 10) } },
        );
        return { status: 200, message: 'Password sucessfully updated' };
      }
      return { status: 400, message: 'Invalid action' };
    } catch (e) {
      const response = handleJoiValidationError(e);
      return response;
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
      await Joi.object({
        slack: Joi.object({ enabled: Joi.bool(), url: Joi.string().uri() }),
        telegram: Joi.object({ enabled: Joi.bool(), botToken: Joi.string(), chatId: Joi.string() }),
        timezone: Joi.string().custom(validateTimezone),
      }).validateAsync(payload);
      const updateDoc = flattenObject(payload);
      const userObject = await User.findOneAndUpdate(
        {}, { $set: updateDoc }, { new: true },
      );
      if ('timezone' in payload) {
        await mongoose.connection
          .getClient()
          .db()
          .collection('jobs')
          .updateMany({ 'data.useDefaultTimezone': true }, { $set: { repeatTimezone: payload.timezone } });
      }
      return { status: 200, user: cleanUserObject(userObject) };
    } catch (e) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async fetchAllJobs() {
    const jobs = await agenda.jobs({});
    return jobs;
  },

  async fetchJob(jobId) {
    const job = await agenda.jobs({ _id: mongoose.Types.ObjectId(jobId) });
    return job;
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
      } = await validateJobConfig(config);
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
      await job.save();
      return { status: 200, job };
    } catch (e) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async updateJob(jobId, config) {
    try {
      const {
        enable, disable, timezone, ...rest
      } = await validateJobConfig(config, 'optional');
      const [job] = await agenda.jobs({ _id: mongoose.Types.ObjectId(jobId) });
      if (!job) {
        return { status: 400, message: `Failed to find job with id: ${jobId}` };
      }

      if (job.isRunning()) {
        return {
          status: 400,
          message: 'Job is currently running. Try again in a few seconds',
        };
      }

      if (enable) {
        job.enable();
      } else if (disable) {
        job.disable();
      }

      job.attrs.data = { ...job.attrs.data, ...rest };
      job.attrs.repeatTimezone = timezone || job.attrs.repeatTimezone;
      await job.save();
      return { status: 200, job };
    } catch (e) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async deleteJob(jobId) {
    // eslint-disable-next-line no-underscore-dangle
    const _id = mongoose.Types.ObjectId(jobId);
    const [job] = await agenda.jobs({ _id });
    if (!job) {
      return { status: 400, message: `Failed to find job with id: ${jobId}` };
    }
    if (job.isRunning()) {
      return {
        status: 400,
        message: 'Job is currently running. Try again in a few seconds',
      };
    }
    await agenda.cancel({ _id });
    return { status: 200, message: 'Job successfully deleted' };
  },
};
