import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Page = ({ children }) => (
  <>
    <Header />
    <Box
      as="main"
      minH={['calc(100vh - 179px)', 'calc(100vh - 147px)']}
    >
      {children}
    </Box>
    <Footer />
  </>
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
