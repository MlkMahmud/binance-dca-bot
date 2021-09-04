import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import EmptyState from './EmptyState';

export default function JobList() {
  return (
    <Box
      d="grid"
      gridAutoRows="auto 1fr"
    >
      <Heading
        as="h2"
        fontSize="2xl"
        mb="15px"
      >
        Jobs(0)
      </Heading>
      <EmptyState />
    </Box>
  );
}
