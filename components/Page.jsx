import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Page({ children }) {
  return (
    <>
      <Header />
      <Box
        as="main"
        minH={['calc(100vh - 179px)', 'calc(100vh - 147px)']}
        px={[2, 5]}
        py={[2, 5]}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};
