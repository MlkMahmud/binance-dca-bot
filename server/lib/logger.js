import bunyan from 'bunyan';

export default bunyan.createLogger({
  name: 'dca-bot',
  streams: [
    { level: 'info', stream: process.stdout },
  ],
  serializers: {
    err: bunyan.stdSerializers.err,
    req: ({ method, url }) => ({
      method,
      url,
    }),
  },
});
