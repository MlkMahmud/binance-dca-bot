import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { User } from '../types';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import Loading from './Loading';


type Props = {
  children: (user: User) => React.ReactNode;
  user: User;
}

const Settings = dynamic(() => import('./Settings'), { loading: ({ error }) => <Loading error={error} /> });
const PasswordSettings = dynamic(() => import('./PasswordSettings'), { loading: ({ error }) => <Loading error={error} /> });

export default function Page({ children, user }: Props) {
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isPasswordSettingsOpen, setIsPasswordSettingsOpen] = useState(false);
  const [userConfig, updateUserConfig] = useState(user);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
