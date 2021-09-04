import React from 'react';
import {
  Box,
  Button,
  Flex,
  Img,
  Stack,
  Text,
} from '@chakra-ui/react';

export default function EmptyState() {
  return (
    <Flex
      align="center"
      direction="column"
      py={2.5}
    >
      <Box
        maxW="400px"
        mb="20px"
      >
        <Img
          height="auto"
          maxW="100%"
          src="/empty.png"
        />
      </Box>
      <Stack align="center" spacing={5}>
        <Text
          fontSize="24px"
          fontWeight="bold"
          textTransform="uppercase"
        >
          no jobs found
        </Text>
        <Text
          color="#36454F"
          maxW="300px"
          textAlign="center"
        >
          You have not created any jobs yet. Would you like to add a new one now?
        </Text>
        <Button
          borderRadius="20px"
          colorScheme="black"
          isFullWidth
          maxW="200px"
        >
          Add Job
        </Button>
      </Stack>
    </Flex>
  );
}
