module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    return config;
  },
};
