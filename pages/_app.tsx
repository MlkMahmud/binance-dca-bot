import Head from 'next/head';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import theme from '../theme';

export default function App({
  Component,
  pageProps,
  err,
}: AppProps & { err: any }) {
  return (
    <>
      <Head>
        <link href="/favicon.ico" rel="icon" />
        <title>Binance DCA Bot</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} err={err} />
      </ChakraProvider>
    </>
  );
}
