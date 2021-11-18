/* eslint-disable react/prop-types */
import React from 'react';
import NextErrorComponent from 'next/error';
import sentry from '../server/lib/sentry';

const Error = ({ hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    sentry.captureException(err);
  }
  return (<NextErrorComponent statusCode={500} />);
};

Error.getInitialProps = async ({ asPath, err, res }) => {
  const initialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  });

  initialProps.hasGetInitialPropsRun = true;

  if (res?.statusCode === 404) {
    return { statusCode: 404 };
  }

  if (err) {
    sentry.captureException(err);
    await sentry.flush(2000);
    return initialProps;
  }

  sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
  );
  await sentry.flush(2000);
  return initialProps;
};

export default Error;
