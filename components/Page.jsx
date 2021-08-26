import { Box, useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Settings from './Settings';

export default function Page({ children }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Header handleClick={onOpen} />
      <Box
        as="main"
        minH={['calc(100vh - 153.68px)', 'calc(100vh - 132.88px)']}
        px={[2, 5]}
        py={[2, 5]}
      >
        {children}
      </Box>
      <Footer />
      <Settings isOpen={isOpen} handleClose={onClose} />
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};
