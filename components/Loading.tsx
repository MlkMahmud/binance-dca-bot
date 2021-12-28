import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay, Text
} from '@chakra-ui/react';
import React from 'react';

type Props = { error?: Error | null };

export default function Loading({ error }: Props) {

  if (error) {
    throw error;
  }

  return (
    <Modal
      isCentered
      isOpen
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={() => {}}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          padding="25px"
        >
          <Text>Loading...</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}