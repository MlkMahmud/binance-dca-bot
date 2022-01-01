import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import agenda from '../server/lib/agenda';
import { Order } from '../server/models';

let memoryServer: MongoMemoryServer;

export default {
  async connect({ startAgenda = false } = {}) {
    memoryServer = await MongoMemoryServer.create();
    const dbUri = memoryServer.getUri();
    await mongoose.connect(dbUri, { dbName: 'dca' });
    if (startAgenda) {
      // @ts-ignore
      agenda.mongo(mongoose.connection.getClient().db(), 'jobs');
      await agenda.start();
    }
  },

  async creatJob() {
    if (memoryServer) {
      const job: any = {
        name: 'buy-crypto',
        data: {
          amount: 450,
          humanInterval: 'At 11:00 PM, every day',
          jobName: 'ETH Daily',
          quoteAsset: 'USDT',
          symbol: 'ETHUSDT',
          useDefaultTimezone: false,
        },
        priority: 0,
        type: 'normal',
        nextRunAt: '2022-01-01T07:00:00.000Z',
        repeatInterval: '0 23 * * *',
        repeatTimezone: 'America/Los_Angeles',
        startDate: null,
        endDate: null,
        skipDays: null,
        lastRunAt: '2021-12-31T15:31:49.997Z',
        lastModifiedBy: null,
        lockedAt: null,
        lastFinishedAt: '2021-12-31T15:31:51.794Z',
        disabled: true,
      };
      const { insertedId } = await mongoose.connection
        .getClient()
        .db()
        .collection('jobs')
        .insertOne(job);
      job._id = insertedId.toString();
      return job;
    }
  },

  async createOrder({
    jobId,
    status = 'FILLED',
  }: {
    jobId: string;
    status?: 'FILLED' | 'PARTIALLY_FILLED';
  }) {
    const order = await Order.create({
      cummulativeQuoteQty: '37.00000000',
      executedQty: '0.05000000',
      fills: [
        {
          commission: '0.00000000',
          commissionAsset: 'ETH',
          price: '740.00000000',
          qty: '0.05000000',
          tradeId: 123137,
        },
      ],
      jobId,
      orderId: 3119984,
      origQty: '0.05000000',
      status,
      symbol: 'ETHUSDT',
      transactTime: '2021-11-13T22:00:00.847Z',
    });
    return order;
  },

  async disconnnect({ stopAgenda = false } = {}) {
    if (memoryServer) {
      if (stopAgenda) {
        await agenda.stop();
      }
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await memoryServer.stop();
    }
  },

  async flush() {
    if (memoryServer) {
      const collections = mongoose.connection.collections;
      const jobCollection = mongoose.connection
        .getClient()
        .db()
        .collection('jobs');
      await jobCollection.deleteMany({});

      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  },
};
