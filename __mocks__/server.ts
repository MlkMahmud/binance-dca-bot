import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
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
  })
);

export { rest, server };
