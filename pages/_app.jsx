/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

const App = ({ Component, pageProps }) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape().isRequired,
};

export default App;
