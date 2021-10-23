import Joi, { ValidationError } from 'joi';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import binance from './lib/binance';
import User from './models';

export default {
  async fetchSymbols(query = '') {
    const { symbols } = await binance.exchangeInfo();
    const options = [];
    symbols.forEach(({ isSpotTradingAllowed, symbol }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        options.push({ label: symbol, value: symbol });
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
};
