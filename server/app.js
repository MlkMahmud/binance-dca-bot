import express from 'express';
import helmet from 'helmet';
import Sentry from './lib/sentry';
import router from './routes';

const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use('/api', router);

export default app;
