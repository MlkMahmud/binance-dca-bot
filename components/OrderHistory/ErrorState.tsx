import { Box, Button, Img, Stack, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onRetry: () => Promise<void>;
};

export default function OrderHistoryErrorState({ onRetry }: Props) {
  return (
    <Stack align="center" justify="center" minH="full">
      <Box maxWidth="200px" mb="20px">
        <Img alt="" height="auto" maxW="100%" src="/error.png" />
      </Box>
      <Stack align="center" spacing={2}>
        <Text color="#36454F" maxW="300px" textAlign="center">
          Failed to fetch orders for this job.
        </Text>
        <Button
          borderRadius="20px"
          colorScheme="black"
          isFullWidth
          maxW="200px"
          onClick={onRetry}
        >
          Try Again.
        </Button>
      </Stack>
    </Stack>
  );
}
