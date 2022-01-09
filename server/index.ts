import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import next from 'next';
import path from 'path';
import app from './app';
import agenda from './lib/agenda';
import rootLogger from './lib/logger';
import sentry from './lib/sentry';
import { User } from './models';

const port = Number(process.env.PORT) || 3000;
const DB_URL = process.env.DB_URL || '';
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev, dir: path.dirname(__dirname) });
const handler = nextApp.getRequestHandler();
const logger = rootLogger.child({ module: 'app' });

(async function start() {
  try {
    await nextApp.prepare();
    app.all('*', (req, res) => handler(req, res));
    app.use(sentry.Handlers.errorHandler());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
      logger.error({ err, req });
      res.status(500);
      res.end();
    });
    await mongoose.connect(DB_URL);
    await User.findOneAndUpdate({}, {}, { upsert: true, runValidators: true });
    // @ts-ignore
    agenda.mongo(mongoose.connection.getClient().db(), 'jobs');
    await agenda.start();
    app.listen(port, () => {
      logger.info(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error({ err });
    process.exit(1);
  }
})();
