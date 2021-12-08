import { Box } from '@chakra-ui/react';
import React from 'react';
import Jobs from '../components/Jobs';
import Page from '../components/Page';
import Portfolio from '../components/Portfolio';
import { User } from '../types';

export default function Index({ user }: { user: User }) {
  return (
    <Page user={user}>
      {({ timezone }) => (
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
          <Jobs defaultTimezone={timezone} />
        </Box>
      )}
    </Page>
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
