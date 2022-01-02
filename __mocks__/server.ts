import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost/api/symbols', (_req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            minNotional: 10,
            quoteAsset: 'USDT',
            symbol: 'BNBUSDT',
          },
        ],
      })
    );
  }),

  rest.get('http://localhost/api/timezones', (_req, res, ctx) => {
    return res(
      ctx.json([
        { label: 'Africa/Lagos', value: 'Africa/Lagos' },
        { label: 'Arfica/Accra', value: 'Africa/Accra' },
      ])
    );
  }),

  rest.patch('http://localhost/api/settings/general', (req, res, ctx) => {
    return res(ctx.json({ data: req.body }));
  }),

  rest.post('http://localhost/login', (_req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.patch('http://localhost/api/jobs/:jobId', (req, res, ctx) => {
    return res(ctx.json({ data: req.body }));
  }),

  rest.delete('http://localhost/api/jobs/:jobId', (_req, res, ctx) => {
    return res(ctx.status(204), ctx.json({ message: 'job deleted' }));
  }),

  rest.get('http://localhost/api/jobs', (_req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            _id: '61b10730ab9b1e8a9b1578ce',
            data: {
              amount: '400',
              humanInterval: 'At 11:00 PM, every day',
              jobName: 'BNB Daily',
              quoteAsset: 'USDT',
              symbol: 'BNBUSDT',
              useDefaultTimezone: false,
            },
            disabled: true,
            nextRunAt: new Date('2021-12-25T22:00:00.000+00:00'),
            lastRunAt: new Date('2021-12-24T22:00:00.000+00:00'),
            repeatInterval: '0 23 * * *',
            repeatTimezone: 'Africa/Lagos',
          },
        ],
      })
    );
  }),

  rest.get('http://localhost/api/jobs/:jobId/orders', (_req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  }),

  rest.get('http://localhost/api/balance', (_req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          { asset: 'USDT', free: '5000.00', locked: '250.00', total: 5250.0 },
          { asset: 'BNB', free: '1000.00', locked: '250.00', total: 1250.0 },
          { asset: 'ETH', free: '100.00', locked: '0.00', total: 100.0 },
          { asset: 'BTC', free: '1.00', locked: '0.00', total: 1.0 },
        ],
      })
    );
  })
);

export { rest, server };
