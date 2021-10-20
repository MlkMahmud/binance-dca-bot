import Joi, { ValidationError } from 'joi';
import { hashSync } from 'bcrypt';
import binance from './lib/binance';
import User from './models';
import { generateSelectOption } from '../utils';

export default {
  async fetchSymbols(query = '') {
    const { symbols } = await binance.exchangeInfo();
    const options = [];
    symbols.forEach(({ isSpotTradingAllowed, symbol }) => {
      if (isSpotTradingAllowed && symbol.includes(query.toUpperCase())) {
        options.push(generateSelectOption(symbol));
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
};
