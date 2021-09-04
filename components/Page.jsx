import { useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';

const Settings = dynamic(() => import('./Settings'), { ssr: false });

export default function Page({ children }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [settings, updateSettings] = useState({
    slack: 'https://google.com',
    telegramBotToken: '1234567890',
    telegramChatId: '0987654321',
    timezone: 'Africa/Lagos',
  });

  return (
    <>
      <Header handleClick={onOpen} />
      {children}
      <Footer />
      {isOpen && (
        <Settings
          handleClose={onClose}
          handleUpdate={updateSettings}
          initialValues={settings}
          isOpen={isOpen}
        />
      )}
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};
