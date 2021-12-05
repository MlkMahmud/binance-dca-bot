import React from 'react';
import {
  Flex, Spinner, Stack, Text,
} from '@chakra-ui/react';

export default function JobListLoadingState() {
  return (
    <Flex
      align="center"
      justify="center"
    >
      <Stack align="center" spacing={2}>
        <Spinner size="xl" thickness="10px" />
        <Text>Loading jobs...</Text>
      </Stack>
    </Flex>
  );
}
