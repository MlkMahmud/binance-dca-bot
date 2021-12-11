import { Box, Img, Stack, Text } from '@chakra-ui/react';
import React from 'react';


export default function OrderHistoryEmptyState() {
  return (
    <Stack align="center" justify="center" minH="full">
      <Box maxWidth="200px" mb="20px">
        <Img alt="" height="auto" maxW="100%" src="/empty.png" />
      </Box>
      <Stack align="center" spacing={2}>
        <Text color="#36454F" maxW="300px" textAlign="center">
          There are currenlty no orders for this job.
        </Text>
      </Stack>
    </Stack>
  );
}
