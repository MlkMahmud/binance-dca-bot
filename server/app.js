import express from 'express';
import helmet from 'helmet';
import Sentry from './lib/sentry';
import baseRouter from './routes/baseRouter';

const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(baseRouter);

export default app;
