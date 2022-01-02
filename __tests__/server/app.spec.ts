import bcrypt from 'bcrypt';
import { Cookie } from 'tough-cookie';
import request from 'supertest';
import app from '../../server/app';
import { User } from '../../server/models';
import database from '../../__mocks__/database';
import binance from '../../server/lib/binance';

const password = 'supersecret';
const job = {
  amount: 400,
  jobName: 'BNB Daily',
  schedule: '0 23 * * *',
  symbol: 'BTCUSDT',
  timezone: 'America/Los_Angeles',
  quoteAsset: 'USDT',
  useDefaultTimezone: false,
};

beforeAll(async () => {
  jest
    .spyOn(binance, 'exchangeInfo')
    // @ts-ignore
    .mockImplementation(({ symbol }: { symbol: string }) => {
      const symbols = ['BNBUSDT', 'BTCUSDT', 'ETHUSDT'];
      if (symbols.includes(symbol.toUpperCase())) {
        return Promise.resolve(symbol);
      }
      throw new Error();
    });
  // @ts-ignore
  jest.spyOn(binance, 'myTrades').mockImplementation(() => {
    return Promise.resolve([
      {
        commission: '0.00000000',
        commissionAsset: 'ETH',
        price: '740.00000000',
        qty: '0.05000000',
        tradeId: 123137,
      },
      {
        commission: '0.00000000',
        commissionAsset: 'ETH',
        price: '755.00000000',
        qty: '0.43000000',
        tradeId: 123133,
      },
    ]);
  });
  await database.connect({ startAgenda: true });
});

beforeEach(async () => {
  await User.create({
    password: { enabled: false, hash: bcrypt.hashSync(password, 10) },
  });
});

afterEach(async () => {
  await database.flush();
});

afterAll(async () => {
  await database.disconnnect({ stopAgenda: true });
});

describe('/login', () => {
  it('should log a user in', async () => {
    await User.findOneAndUpdate({}, { $set: { 'password.enabled': true } });
    const response = await request(app).post('/login').send({ password });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('message', 'success');
    expect(Cookie.parse(response.get('Set-Cookie')[0]).toJSON()).toHaveProperty(
      'key',
      'accessToken'
    );
  });

  it('should not accept an incorrect password', async () => {
    await User.findOneAndUpdate({}, { $set: { 'password.enabled': true } });
    const response = await request(app)
      .post('/login')
      .send({ password: 'incorrectpassword' });
    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty('message', 'password is incorrect');
    expect(response.get('Set-Cookie')).not.toBeDefined();
  });
});

describe('/logout', () => {
  it('should log a user out', async () => {
    await User.findOneAndUpdate({}, { $set: { 'password.enabled': true } });
    const req = request.agent(app);
    const loginRes = await req.post('/login').send({ password });
    expect(Cookie.parse(loginRes.get('Set-Cookie')[0]).toJSON()).toHaveProperty(
      'key',
      'accessToken'
    );
    const response = await req.post('/logout');
    expect(response.body).toEqual({});
    expect(Cookie.parse(response.get('Set-Cookie')[0]).toJSON()).toHaveProperty(
      'key',
      'accessToken'
    );
    expect(
      Cookie.parse(response.get('Set-Cookie')[0]).toJSON()
    ).not.toHaveProperty('value');
  });
});

describe('POST /api/settings/password', () => {
  it('should set a password', async () => {
    await User.findOneAndUpdate({}, { password: { enabled: false, hash: '' } });
    const response = await request(app).post('/api/settings/password').send({
      confirmPassword: password,
      password,
    });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty(
      'message',
      'Password set successfully'
    );
  });

  it('should ensure password is at least 8 chars long', async () => {
    await User.findOneAndUpdate({}, { password: { enabled: false, hash: '' } });
    const response = await request(app).post('/api/settings/password').send({
      confirmPassword: 'short',
      password: 'short',
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      '"Password" length must be at least 8 characters long'
    );
  });

  it('should not set a password if the user already has one', async () => {
    const newPassword = 'newPassword';
    const response = await request(app).post('/api/settings/password').send({
      confirmPassword: newPassword,
      password: newPassword,
    });
    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty('message', 'Password already exists.');
    const user = await User.findOne();
    expect(bcrypt.compareSync(password, user.password.hash)).toBeTruthy();
    expect(
      bcrypt.compareSync(newPassword, user.password.hash)
    ).not.toBeTruthy();
  });

  it("should not set a password if confirm passsword and password field don't match", async () => {
    await User.findOneAndUpdate({}, { password: { enabled: false, hash: '' } });
    const response = await request(app).post('/api/settings/password').send({
      confirmPassword: 'missmatch',
      password,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      '"Confirm password" does not match password'
    );
  });
});

describe('PATCH /api/settings/password', () => {
  it('should respond with an error message if password has not been set', async () => {
    await User.findOneAndUpdate({}, { password: { enabled: false, hash: '' } });
    const response = await request(app).patch('/api/settings/password');
    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty(
      'message',
      'Password has not been set yet.'
    );
  });

  it('should response with an error message if password is incorrect', async () => {
    const response = await request(app).patch('/api/settings/password').send({
      action: 'enable',
      password: 'wrongpassword',
    });
    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty('message', 'Password is incorrect');
  });

  it("should enable a user's password", async () => {
    const response = await request(app).patch('/api/settings/password').send({
      action: 'enable',
      password,
    });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(
      'message',
      'Password sucessfully enabled'
    );
    const user = await User.findOne();
    expect(user.password.enabled).toBeTruthy();
  });

  it("should update a user's password", async () => {
    const newPassword = 'newPassword';
    const response = await request(app).patch('/api/settings/password').send({
      action: 'update',
      newPassword,
      password,
    });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(
      'message',
      'Password sucessfully updated'
    );
    const user = await User.findOne({});
    expect(bcrypt.compareSync(newPassword, user.password.hash)).toBeTruthy();
  });

  it('should not update password if new password and old password are the same', async () => {
    const response = await request(app).patch('/api/settings/password').send({
      action: 'update',
      newPassword: password,
      password,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      'new password cannot be the same as the old.'
    );
  });

  it("should disable a user's password", async () => {
    await User.findOneAndUpdate({}, { $set: { 'password.enabled': true } });
    const req = request.agent(app);
    await req.post('/login').send({ password });
    const response = await req.patch('/api/settings/password').send({
      action: 'disable',
      password,
    });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(
      'message',
      'Password sucessfully disabled'
    );
    const user = await User.findOne();
    expect(user.password.enabled).not.toBeTruthy();
  });

  it('should send an error message if action is not valid', async () => {
    const response = await request(app).patch('/api/settings/password').send({
      action: 'invalid action',
      password,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Invalid action');
  });
});

describe('/api/settings/general', () => {
  it("should update a user's slack settings", async () => {
    const slackUrl = 'http://webhook.com';
    const response = await request(app)
      .patch('/api/settings/general')
      .send({
        slack: { enabled: true, url: slackUrl },
      });
    const { slack } = await User.findOne();
    expect(response.status).toEqual(200);
    expect(slack.enabled).toBeTruthy();
    expect(slack.url).toEqual(slackUrl);
  });

  it("should update a user's telegram settings", async () => {
    const botToken = 'botToken';
    const chatId = 'chatId';
    const response = await request(app)
      .patch('/api/settings/general')
      .send({
        telegram: { botToken, chatId, enabled: true },
      });
    const { telegram } = await User.findOne();
    expect(response.status).toEqual(200);
    expect(telegram.botToken).toEqual(botToken);
    expect(telegram.chatId).toEqual(chatId);
    expect(telegram.enabled).toBeTruthy();
  });

  it("should update a user's timezone", async () => {
    const timezone = 'America/Los_Angeles';
    const response = await request(app)
      .patch('/api/settings/general')
      .send({ timezone });
    const user = await User.findOne();
    expect(response.status).toEqual(200);
    expect(user.timezone).toEqual(timezone);
  });
});

describe('POST /api/jobs', () => {
  it('should create a new job', async () => {
    const response = await request(app).post('/api/jobs').send(job);
    expect(response.status).toEqual(201);
    const res = await request(app).get('/api/jobs');
    const jobs = res.body.data;
    expect(res.status).toEqual(200);
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toHaveProperty('data', {
      amount: job.amount,
      humanInterval: 'At 11:00 PM, every day',
      jobName: job.jobName,
      quoteAsset: job.quoteAsset,
      symbol: job.symbol,
      useDefaultTimezone: job.useDefaultTimezone,
    });
    expect(jobs[0]).toHaveProperty('repeatInterval', job.schedule);
    expect(jobs[0]).toHaveProperty('repeatTimezone', job.timezone);
  });

  it('should not create a job with missing config parameters', async () => {
    const response = await request(app)
      .post('/api/jobs')
      .send({ ...job, jobName: '' });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      '"jobName" is not allowed to be empty'
    );
    const res = await request(app).get('/api/jobs');
    expect(res.status).toEqual(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('should not create a job with useDefaultTimezone if default timezone is not set', async () => {
    const response = await request(app)
      .post('/api/jobs')
      .send({ ...job, useDefaultTimezone: true });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      'default timezone has not been set yet'
    );
    const res = await request(app).get('/api/jobs');
    expect(res.status).toEqual(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('GET /api/jobs/:jobId', () => {
  it('should should get a job by its id', async () => {
    const newJob = await database.creatJob();
    const response = await request(app).get(`/api/jobs/${newJob._id}`);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('data', newJob);
  });

  it("should return an empty object if job with id doesn't not exist", async () => {
    const fakeId = '61cf7efd6dc4ddb21fae6c8e';
    const response = await request(app).get(`/api/jobs/${fakeId}`);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('data', {});
  });

  it('should return an error message if jobId is not a valid objectId', async () => {
    const invalidId = 'abc';
    const response = await request(app).get(`/api/jobs/${invalidId}`);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      `job id ${invalidId} is invalid`
    );
  });
});

describe('DELETE /api/jobs/:jobId', () => {
  it('should delete the job with the selected Id', async () => {
    const newJob = await database.creatJob();
    const jobRes = await request(app).get(`/api/jobs/${newJob._id}`);
    expect(jobRes.body).toHaveProperty('data', newJob);
    const response = await request(app).delete(`/api/jobs/${newJob._id}`);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('message', 'Job successfully deleted');
    const postRes = await request(app).get(`/api/jobs/${newJob._id}`);
    expect(postRes.body).toHaveProperty('data', {});
  });

  it('should return an error message if job does not exist', async () => {
    const fakeId = '61cf7efd6dc4ddb21fae6c8e';
    const response = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to find job with id: 61cf7efd6dc4ddb21fae6c8e'
    );
  });
});

describe('PATCH /api/jobs/:jobId', () => {
  it('should update the selected job', async () => {
    const job = await database.creatJob();
    const values = {
      amount: 1000,
      jobName: 'BNB edited',
      timezone: 'Africa/Lagos',
    };
    const response = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send(values);
    expect(response.status).toEqual(200);
    const updatedJob = response.body.data;
    expect(updatedJob).toHaveProperty('_id', job._id);
    expect(updatedJob.data).toHaveProperty('amount', values.amount);
    expect(updatedJob.data).toHaveProperty('jobName', values.jobName);
    expect(updatedJob).toHaveProperty('repeatTimezone', values.timezone);
  });

  it("should not update a job's schedule or symbol", async () => {
    const job = await database.creatJob();
    const firstRes = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ schedule: '0 19 * * *' });
    const secondRes = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ symbol: 'BNBUSDT' });
    expect(firstRes.body).toHaveProperty(
      'message',
      'schedule cannot be updated once set'
    );
    expect(secondRes.body).toHaveProperty(
      'message',
      'symbol cannot be updated once set'
    );
    const response = await request(app).get(`/api/jobs/${job._id}`);
    const _job = response.body.data;
    expect(_job._id).toEqual(job._id);
    expect(_job.data).toHaveProperty('symbol', job.data.symbol);
    expect(_job.repeatTimezone).toEqual(job.repeatTimezone);
  });

  it('should return an error message if job does not exist', async () => {
    const fakeId = '61cf7efd6dc4ddb21fae6c8e';
    const response = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ jobName: 'ab' });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to find job with id: 61cf7efd6dc4ddb21fae6c8e'
    );
  });
});

describe('GET /api/jobs/:jobId/orders', () => {
  it('should return all orders for a job', async () => {
    const job = await database.creatJob();
    const firstOrder = await database.createOrder({ jobId: job._id });
    const secondOrder = await database.createOrder({ jobId: job._id });
    const response = await request(app).get(`/api/jobs/${job._id}/orders`);
    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty(
      '_id',
      firstOrder._id.toString()
    );
    expect(response.body.data[0]).toHaveProperty('jobId', job._id);
    expect(response.body.data[1]).toHaveProperty(
      '_id',
      secondOrder._id.toString()
    );
    expect(response.body.data[1]).toHaveProperty('jobId', job._id);
  });

  it('should return an empty array if there are no jobs', async () => {
    const job = await database.creatJob();
    const response = await request(app).get(`/api/jobs/${job._id}/orders`);
    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(0);
  });
});

describe('PATCH /api/orders/:orderId', () => {
  it('should update a patially filled order', async () => {
    // @ts-ignore
    jest.spyOn(binance, 'getOrder').mockImplementationOnce(() => {
      return Promise.resolve({
        status: 'FILLED',
        updateTime: 1547075016737,
      });
    });
    const job = await database.creatJob();
    const order = await database.createOrder({
      jobId: job._id,
      status: 'PARTIALLY_FILLED',
    });
    const response = await request(app)
      .patch(`/api/orders/${order.orderId}`)
      .send({
        orderId: order.orderId,
        symbol: job.data.symbol,
      });
    const updatedOrder = response.body.data;
    expect(response.status).toEqual(200);
    expect(updatedOrder._id).toEqual(order._id.toString());
    expect(updatedOrder.status).not.toEqual(order.status);
    expect(updatedOrder.status).toEqual('FILLED');
    expect(updatedOrder.fills).toHaveLength(2);
    expect(updatedOrder.fills).not.toHaveLength(order.fills.length);
  });

  it('should return an error message if the order does not exist', async () => {
    const job = await database.creatJob();
    const fakeOrderId = 1234;
    const symbol = job.data.symbol;
    const response = await request(app)
      .patch(`/api/orders/${fakeOrderId}`)
      .send({
        orderId: fakeOrderId,
        symbol,
      });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty(
      'message',
      `Failed to find order with orderId :${fakeOrderId} and symbol: ${symbol}`
    );
  });
});
