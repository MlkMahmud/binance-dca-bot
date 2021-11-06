import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export default function Loading() {
  return (
    <Flex
      align="center"
      bgColor="black"
      height="100%"
      justify="center"
      left="0"
      opacity=".6"
      position="absolute"
      top="0"
      width="100%"
      zIndex="5"
    >
      <Spinner size="xl" />
    </Flex>
  );
}
