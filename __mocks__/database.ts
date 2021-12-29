import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import agenda from '../server/lib/agenda';

let memoryServer: MongoMemoryServer;

export default {
  async connect(connectAgenda = false) {
    memoryServer = await MongoMemoryServer.create();
    const dbUri = memoryServer.getUri();
    await mongoose.connect(dbUri, { dbName: 'dca' });
    if (connectAgenda) {
      // @ts-ignore
      agenda.mongo(mongoose.connection.getClient().db(), 'jobs');
      await agenda.start();
    }
  },

  async disconnnect() {
    if (memoryServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await memoryServer.stop();
    }
  },

  async flush() {
    if (memoryServer) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  },
};
