import {
  Box,
  Button,
  Flex,
  Img,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClick: () => void;
}

export default function JobListEmptyState({ onClick }: Props) {
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
          alt=""
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
          onClick={onClick}
        >
          Add Job
        </Button>
      </Stack>
      <Text
        color="#262626"
        fontSize="14px"
        mt="40px"
      >
        Illustration by
        {' '}
        <Link
          color="blue.500"
          href="https://icons8.com/illustrations/author/5dca95ef01d036001426e2bc"
          textDecor="underline"
        >
          Ivan Haidutsk
          {' '}
        </Link>
        from
        {' '}
        <Link
          color="blue.500"
          href="https://icons8.com/illustrations"
          textDecor="underline"
        >
          Ouch!
        </Link>
      </Text>
    </Flex>
  );
}
