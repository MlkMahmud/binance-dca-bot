import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { displayToast } from '../client-utils';
import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Jobs from '../components/Jobs';
import Loading from '../components/Loading';
import Portfolio from '../components/Portfolio';
import { User } from '../types';

type Props = {
  user: User;
};

const Settings = dynamic(() => import('../components/Settings'), {
  loading: ({ error }) => <Loading error={error} />,
});
const PasswordSettings = dynamic(
  () => import('../components/PasswordSettings'),
  { loading: ({ error }) => <Loading error={error} /> }
);

export default function Index({ user }: Props) {
  const router = useRouter();
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isPasswordSettingsOpen, setIsPasswordSettingsOpen] = useState(false);
  const [userConfig, updateUserConfig] = useState(user);

  return (
    <ErrorBoundary>
      <Header
        isPasswordEnabled={userConfig.password.enabled}
        onGlobalSettingsClick={() => setIsGeneralSettingsOpen(true)}
        onLogoutSuccess={async () => {
          try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
              router.replace('/login');
            } else {
              throw Error(response.statusText);
            }
          } catch {
            displayToast({
              description: 'Logout failed. Try again',
              title: 'Error',
            });
          }
        }}
        onPasswordSettingsClick={() => setIsPasswordSettingsOpen(true)}
      />
      <Box
        as="main"
        d="grid"
        gridRowGap="20px"
        gridTemplateRows="auto 1fr"
        minH={['calc(100vh - 153.68px)', 'calc(100vh - 132.88px)']}
        px={[2, 5]}
        py={[2, 5]}
      >
        <Portfolio />
        <Jobs defaultTimezone={userConfig.timezone} />
      </Box>
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

export async function getServerSideProps({ req }: any) {
  const { user } = await req;
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return { props: { user } };
}
