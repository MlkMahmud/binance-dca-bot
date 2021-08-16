import 'antd/dist/antd.min.css';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line react/jsx-props-no-spreading
const App = ({ Component, pageProps }) => <Component {...pageProps} />;

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape().isRequired,
};

export default App;
