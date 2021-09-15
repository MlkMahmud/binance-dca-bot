/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import PropTypes from 'prop-types';
import React from 'react';
import theme from '../theme';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="/favicon.ico" rel="icon" />
        <title>Binance DCA Bot</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape().isRequired,
};
