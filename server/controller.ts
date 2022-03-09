import { compareSync, hashSync } from 'bcrypt';
import { AssetBalance, SymbolMinNotionalFilter } from 'binance-api-node';
import cronstrue from 'cronstrue';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import agenda from './lib/agenda';
import binance from './lib/binance';
import { Order, User } from './models';
import {
  cleanUserObject,
  flattenObject,
  handleJoiValidationError,
  validateJobConfig,
  validateTimezone,
} from './utils';
import { JobConfig } from './utils';

const JWT_SECRET = process.env.JWT_SECRET || '';

interface Balance extends AssetBalance {
  total: number;
}

type Settings = {
  slack: { enabled: boolean; url: string };
  telegram: { botToken: string; chatId: string; enabled: boolean };
  timezone: string;
};

export default {
  fetchTimezones(query = '') {
    const tzs: Array<{ label: string; value: string }> = [];
    moment.tz.names().forEach((timezone) => {
      if (timezone.toLowerCase().includes(query.toLowerCase())) {
        tzs.push({ label: timezone, value: timezone });
      }
    });
    return tzs;
  },
  async fetchSymbols(query = '') {
    const { symbols } = await binance.exchangeInfo();
    const options: Array<{
      minNotional: number;
      symbol: string;
      quoteAsset: string;
    }> = [];
    symbols.forEach(({ filters, isSpotTradingAllowed, quoteAsset, symbol }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        const filter = filters.find(
          ({ filterType }) => filterType === 'MIN_NOTIONAL'
        );
        if (filter) {
          const { minNotional } = filter as SymbolMinNotionalFilter;
          options.push({
            symbol,
            minNotional: Number(minNotional),
            quoteAsset,
          });
        }
      }
    });
    return options;
  },

  async fetchAccountBalance() {
    const { balances } = await binance.accountInfo();
    const nonZeroBalances: Balance[] = [];
    balances.forEach((balance) => {
      if (+balance.free > 0 || +balance.locked > 0) {
        nonZeroBalances.push({
          ...balance,
          total: Number(balance.free) + Number(balance.locked),
        });
      }
    });
    return nonZeroBalances;
  },

  async setPassword(data: { password: string; confirmPassword: string }) {
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
        { password: { enabled: true, hash: hashSync(password, 10) } }
      );
      return {
        status: 201,
        message: 'Password set successfully',
      };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async updatePassword({
    action,
    password = '',
    newPassword,
  }: {
    action: 'disable' | 'enable' | 'update';
    password?: string;
    newPassword?: string;
  }) {
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
        await User.findOneAndUpdate(
          {},
          { $set: { 'password.enabled': false } }
        );
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
          { $set: { 'password.hash': hashSync(newPassword as string, 10) } }
        );
        return { status: 200, message: 'Password sucessfully updated' };
      }
      return { status: 400, message: 'Invalid action' };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async loginUser(password: string) {
    const user = await User.findOne();
    if (compareSync(password, user.password.hash)) {
      // This is a single user system.
      // so it seems pointless to encode any unique attribute in the jwt payload
      const accessToken = jwt.sign({}, JWT_SECRET);
      return { status: 200, accessToken, message: 'success' };
    }
    return { status: 403, message: 'password is incorrect' };
  },

  async updateSettings(payload: Partial<Settings>) {
    try {
      await Joi.object({
        slack: Joi.object({ enabled: Joi.bool(), url: Joi.string().uri() }),
        telegram: Joi.object({
          enabled: Joi.bool(),
          botToken: Joi.string(),
          chatId: Joi.string(),
        }),
        timezone: Joi.string().custom(validateTimezone),
      }).validateAsync(payload);
      const updateDoc = flattenObject(payload);
      const session = await mongoose.startSession();
      session.startTransaction();
      const userObject = await User.findOneAndUpdate(
        {},
        { $set: updateDoc },
        { new: true }
      );
      if ('timezone' in payload) {
        await mongoose.connection
          .getClient()
          .db()
          .collection('jobs')
          .updateMany(
            { 'data.useDefaultTimezone': true },
            { $set: { repeatTimezone: payload.timezone } }
          );
      }
      await session.commitTransaction();
      return { status: 200, data: cleanUserObject(userObject) };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async fetchAllJobs() {
    const jobs = await mongoose.connection
      .getClient()
      .db()
      .collection('jobs')
      .find()
      .project({
        data: 1,
        disabled: 1,
        lastRunAt: 1,
        nextRunAt: 1,
        repeatInterval: 1,
        repeatTimezone: 1,
      })
      .toArray();
    return jobs;
  },

  async fetchJob(jobId: string) {
    if (!mongoose.isValidObjectId(jobId)) {
      return { status: 400, message: `job id ${jobId} is invalid` };
    }
    const _id = new mongoose.Types.ObjectId(jobId);
    const [job = {}] = await agenda.jobs({ _id }, {}, 1);
    return { status: 200, data: job };
  },

  async createJob(config: JobConfig) {
    try {
      const {
        amount,
        jobName,
        schedule,
        quoteAsset,
        symbol,
        timezone,
        useDefaultTimezone,
      } = await validateJobConfig(config);
      if (useDefaultTimezone) {
        const user = await User.findOne();
        if (!user.timezone) {
          return {
            status: 400,
            message: 'default timezone has not been set yet',
          };
        }
      }
      const job = agenda.create('buy-crypto', {
        amount,
        humanInterval: cronstrue.toString(schedule, { verbose: true }),
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
      return { status: 201, data: job };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async updateJob(jobId: string, config: Partial<JobConfig>) {
    try {
      const { timezone, ...data } = await validateJobConfig(config, 'optional');

      if (!mongoose.isValidObjectId(jobId)) {
        return { status: 400, message: `job id ${jobId} is invalid` };
      }

      let invalidField = null;
      ['schedule', 'symbol', 'quoteAsset'].forEach((field) => {
        if (field in data) {
          invalidField = field;
        }
      });

      if (invalidField) {
        return {
          status: 400,
          message: `${invalidField} cannot be updated once set`,
        };
      }

      if (data.useDefaultTimezone) {
        const user = await User.findOne();
        if (!user.timezone) {
          return {
            status: 400,
            message: 'default timezone has not been set yet',
          };
        }
      }

      const _id = new mongoose.Types.ObjectId(jobId);
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
      job.attrs.data = { ...job.attrs.data, ...data };
      job.attrs.repeatTimezone = timezone || job.attrs.repeatTimezone;
      await job.save();
      return { status: 200, data: job };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },

  async deleteJob(jobId: string) {
    if (!mongoose.isValidObjectId(jobId)) {
      return { status: 400, message: `job id ${jobId} is invalid` };
    }
    const _id = new mongoose.Types.ObjectId(jobId);
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

  async getOrders(jobId: string) {
    const orders = await Order.find({ jobId }, null, {
      sort: { transactTime: -1 },
    });
    return { data: orders };
  },

  async updateOrderStatus(payload: { orderId: number; symbol: string }) {
    try {
      const { orderId, symbol } = await Joi.object({
        orderId: Joi.number().required(),
        symbol: Joi.string().required(),
      }).validateAsync(payload);

      const order = await Order.findOne({ orderId, symbol });
      if (!order) {
        return {
          status: 400,
          message: `Failed to find order with orderId :${orderId} and symbol: ${symbol}`,
        };
      }
      if (order.status === 'FILLED') {
        return { status: 200, data: order };
      }
      const orderToUpdate = await binance.getOrder({ orderId, symbol });
      if (orderToUpdate.status === 'FILLED') {
        // @ts-ignore
        const trades = await binance.myTrades({ orderId, symbol });
        const fills = trades.map((trade) => ({
          commission: trade.commission,
          commissionAsset: trade.commissionAsset,
          price: trade.price,
          qty: trade.qty,
          tradeId: trade.id,
        }));
        const transactTime = new Date(orderToUpdate.updateTime).toISOString();
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId, symbol },
          { fills, status: orderToUpdate.status, transactTime },
          { new: true }
        );
        return { status: 200, data: updatedOrder };
      }
      return { status: 200, data: order };
    } catch (e: any) {
      const response = handleJoiValidationError(e);
      return response;
    }
  },
};
