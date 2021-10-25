import PropTypes from 'prop-types';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';

const Settings = dynamic(() => import('./Settings'));
const PasswordSettings = dynamic(() => import('./PasswordSettings'));

export default function Page({ children, user }) {
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [isPasswordSettingsOpen, setIsPasswordSettingsOpen] = useState(false);
  const [userConfig, updateUserConfig] = useState(user);

  return (
    <>
      <Header
        isPasswordEnabled={userConfig.password.enabled}
        onGlobalSettingsClick={() => setIsGlobalSettingsOpen(true)}
        onPasswordSettingsClick={() => setIsPasswordSettingsOpen(true)}
      />
      {children}
      <Footer />
      {isGlobalSettingsOpen && (
        <Settings
          initialValues={userConfig}
          isOpen={isGlobalSettingsOpen}
          onClose={() => setIsGlobalSettingsOpen(false)}
          onUpdate={updateUserConfig}
        />
      )}
      {isPasswordSettingsOpen && (
        <PasswordSettings
          isOpen={isPasswordSettingsOpen}
          onClose={() => setIsPasswordSettingsOpen(false)}
          onUpdate={() => {}}
        />
      )}
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    slack: PropTypes.shape(),
    password: PropTypes.shape(),
    telegram: PropTypes.shape(),
    timezone: PropTypes.string,
  }).isRequired,
};
