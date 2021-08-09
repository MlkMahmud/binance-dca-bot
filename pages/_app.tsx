import React from "react";
import { AppProps } from "next/app";
import "antd/dist/antd.min.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default App;
