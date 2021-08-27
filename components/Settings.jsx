import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { FaSlack, FaTelegramPlane } from 'react-icons/fa';
import { VscQuestion } from 'react-icons/vsc';
import { useMediaQuery } from '../utils';

function Info({ message }) {
  return (
    <Tooltip label={message}>
      <IconButton
        icon={<Icon as={VscQuestion} />}
        minW="fit-content"
        variant="unstyled"
      />
    </Tooltip>
  );
}

Info.propTypes = {
  message: PropTypes.node.isRequired,
};

function Wrapper({ children, handleClose, isOpen }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  if (isMobile) {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        placement="bottom"
      >
        <DrawerOverlay />
        <DrawerContent>
          <Box
            borderBottom="1px solid #E2E8F0"
          >
            <DrawerHeader>
              <Text color="gray.900" fontSize="lg" fontWeight="bold">Settings</Text>
              <Text color="gray.600" fontSize="sm">Edit your global timezone and notification settings here.</Text>
            </DrawerHeader>
          </Box>
          <DrawerCloseButton />
          <DrawerBody>
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <Box
          borderBottom="1px solid #E2E8F0"
        >
          <ModalHeader>
            <Text color="gray.900" fontSize="lg" fontWeight="bold">Settings</Text>
            <Text color="gray.600" fontSize="sm">Edit your global timezone and notification settings here.</Text>
          </ModalHeader>
        </Box>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default function Settings({ handleClose, isOpen }) {
  return (
    <Wrapper
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <form>
        <Stack spacing={4}>
          <FormControl id="timezone">
            <FormLabel mb="0">
              <Stack align="center" isInline spacing={1}>
                <Text fontSize="17px" fontWeight="bold">
                  Timezone
                </Text>
                <Info message="hellur loser" />
              </Stack>
            </FormLabel>
            <Select options={[]} placeholder="Africa/Lagos" />
          </FormControl>
          <FormControl id="slack">
            <FormLabel mb="0">
              <Stack align="center" isInline spacing={1}>
                <Text fontSize="17px" fontWeight="bold">
                  Slack
                </Text>
                <Info message="hellur loser" />
              </Stack>
            </FormLabel>
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <Icon as={FaSlack} boxSize="25px" />
              </InputRightElement>
              <Input type="url" />
            </InputGroup>
          </FormControl>
          <FormControl id="telegram">
            <FormLabel mb="0">
              <Stack align="center" isInline spacing={1}>
                <Text fontSize="17px" fontWeight="bold">
                  Telegram
                </Text>
                <Info message="hellur loser" />
              </Stack>
            </FormLabel>
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <Icon
                  as={FaTelegramPlane}
                  boxSize="25px"
                />
              </InputRightElement>
              <Input type="text" />
            </InputGroup>
          </FormControl>
        </Stack>
      </form>
    </Wrapper>
  );
}

Settings.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
