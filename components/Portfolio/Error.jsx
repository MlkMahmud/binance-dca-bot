import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SpeechBubble } from 'react-kawaii';
import PropTypes from 'prop-types';

export default function Error({ handleClick }) {
  return (
    <Box
      bgColor="#FFF"
      maxW="400px"
      py={5}
      shadow="rgb(0 0 0 / 16%) 0px 1px 2px -2px, rgb(0 0 0 / 12%) 0px 3px 6px 0px, rgb(0 0 0 / 9%) 0px 5px 12px 4px"
    >
      <VStack spacing={4}>
        <SpeechBubble color="#596881" mood="sad" size={100} />
        <Box maxW="280px" textAlign="center">
          <Text fontSize="3xl">Uh oh!</Text>
          <Text>
            We seem to have run into some trouble while retrieving your
            portfolio balance
          </Text>
        </Box>
        <Button
          colorScheme="black"
          onClick={handleClick}
          type="button"
        >
          Try again
        </Button>
      </VStack>
    </Box>
  );
}

Error.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
