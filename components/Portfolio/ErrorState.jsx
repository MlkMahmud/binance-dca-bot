import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SpeechBubble } from 'react-kawaii';
import PropTypes from 'prop-types';

export default function ErrorState({ handleClick }) {
  return (
    <Box
      bgColor="#FFF"
      border="1px solid #DADCE0"
      borderRadius="5px"
      maxW="400px"
      py={5}
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

ErrorState.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
