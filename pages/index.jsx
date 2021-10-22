import React from 'react';
import { Box } from '@chakra-ui/react';
import Page from '../components/Page';
import Portfolio from '../components/Portfolio';
import Jobs from '../components/Jobs';

export default function Index() {
  return (
    <Page>
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
        <Jobs />
      </Box>
    </Page>
  );
}

export async function getServerSideProps({ req }) {
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
