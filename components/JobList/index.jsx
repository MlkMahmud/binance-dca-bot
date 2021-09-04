import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Loading from './Loading';

export default function JobList() {
  return (
    <Box
      d="grid"
      gridAutoRows="auto 1fr"
    >
      <Heading
        as="h2"
        fontSize="3xl"
        mb="15px"
      >
        Jobs (0)
      </Heading>
      <Loading />
    </Box>
  );
}
