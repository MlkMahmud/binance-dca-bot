import { Box, useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';

const Settings = dynamic(() => import('./Settings'), { ssr: false });

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
      {isOpen && (
        <Settings
          handleClose={onClose}
          initialValues={{
            slack: 'https://google.com',
            telegramBotToken: '1234567890',
            telegramChatId: '0987654321',
            timezone: 'Africa/Lagos',
          }}
          isOpen={isOpen}
        />
      )}
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};
