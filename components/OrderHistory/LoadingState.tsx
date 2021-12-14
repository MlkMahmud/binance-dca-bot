import {
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

export default function OrderHistoryLoadingState() {
  return (
    <Stack
      align="center"
      justify="center"
      minH="full"
    >
      <Stack align="center" spacing={1.5}>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
        <Text>Loading orders...</Text>
      </Stack>
    </Stack>
  )
}