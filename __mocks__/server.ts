import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost/api/symbols', (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          minNotional: 10,
          quoteAsset: 'USDT',
          symbol: 'BNBUSDT',
        },
      ])
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
    return res(ctx.json({ user: req.body }));
  }),

  rest.post('http://localhost/login', (_req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.patch('http://localhost/api/jobs/:jobId', (req, res, ctx) => {
    return res(ctx.json({ job: req.body }));
  }),

  rest.get('http://localhost/api/jobs/:jobId/orders', (_req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  })
);

export { rest, server };
