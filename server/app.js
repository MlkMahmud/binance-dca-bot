import express from 'express';
import helmet from 'helmet';
import sentry from './lib/sentry';
import router from './routes';

const app = express();
app.use(sentry.Handlers.requestHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use('/api', router);

export default app;
