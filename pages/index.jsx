import React from 'react';
import { Box } from '@chakra-ui/react';
import Page from '../components/Page';
import Portfolio from '../components/Portfolio';
import JobList from '../components/JobList';

export default function Index() {
  return (
    <Page>
      <Box
        as="main"
        d="grid"
        gridAutoRows="auto 1fr"
        minH={['calc(100vh - 153.68px)', 'calc(100vh - 132.88px)']}
        px={[2, 5]}
        py={[2, 5]}
      >
        <Portfolio />
        <JobList />
      </Box>
    </Page>
  );
}
