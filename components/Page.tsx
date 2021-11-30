import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Loading from './Loading';

type User = {
  password: { enabled: boolean; isSet: boolean };
  slack: { enabled: boolean; url: string },
  telegram: { enabled: boolean; chatId: string; botToken: string; };
  timezone: string;
};

type Props = {
  children: (user: User) => React.ReactNode;
  user: User;
}

const Settings = dynamic(() => import('./Settings'), { loading: () => <Loading /> });
const PasswordSettings = dynamic(() => import('./PasswordSettings'), { loading: () => <Loading /> });

export default function Page({ children, user }: Props) {
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
