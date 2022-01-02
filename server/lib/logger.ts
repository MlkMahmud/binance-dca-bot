import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'dca-bot',
  streams: [{ level: 'info', stream: process.stdout }],
  serializers: {
    err: bunyan.stdSerializers.err,
    req: ({ method, url }: { method: string; url: string }) => ({
      method,
      url,
    }),
  },
});

if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1);
}

export default logger;
