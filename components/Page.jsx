import PropTypes from 'prop-types';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import Loading from './Loading';

const Settings = dynamic(() => import('./Settings'), { loading: () => <Loading /> });
const PasswordSettings = dynamic(() => import('./PasswordSettings'), { loading: () => <Loading /> });

export default function Page({ children, user }) {
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isPasswordSettingsOpen, setIsPasswordSettingsOpen] = useState(false);
  const [userConfig, updateUserConfig] = useState(user);

  return (
    <>
      <Header
        isPasswordEnabled={userConfig.password.enabled}
        onGlobalSettingsClick={() => setIsGeneralSettingsOpen(true)}
        onPasswordSettingsClick={() => setIsPasswordSettingsOpen(true)}
      />
      {children(userConfig)}
      <Footer />
      {isGeneralSettingsOpen && (
        <Settings
          initialValues={userConfig}
          isOpen={isGeneralSettingsOpen}
          onClose={() => setIsGeneralSettingsOpen(false)}
          onUpdate={updateUserConfig}
        />
      )}
      {isPasswordSettingsOpen && (
        <PasswordSettings
          isOpen={isPasswordSettingsOpen}
          onClose={() => setIsPasswordSettingsOpen(false)}
          onUpdate={updateUserConfig}
          user={userConfig}
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
