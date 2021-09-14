import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '../utils';

const Overlay = React.forwardRef(
  ({
    children,
    handleClose,
    isLoading,
    isOpen,
    subTitle,
    title,
  }, ref) => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const SaveButton = () => (
      <Button
        colorScheme="black"
        form="settings"
        isFullWidth={isMobile}
        isLoading={isLoading}
        mb={isMobile ? '10px' : 0}
        ref={ref}
        type="submit"
      >
        Save
      </Button>
    );

    const CancelButton = () => (
      <Button
        colorScheme="red"
        isFullWidth={isMobile}
        mr={isMobile ? '0' : '10px'}
        onClick={handleClose}
      >
        Cancel
      </Button>
    );

    if (isMobile) {
      return (
        <Drawer isOpen={isOpen} onClose={handleClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <Box borderBottom="1px solid #E2E8F0">
              <DrawerHeader>
                <Text color="gray.900" fontSize="lg" fontWeight="bold">
                  {title}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {subTitle}
                </Text>
              </DrawerHeader>
            </Box>
            <DrawerCloseButton />
            <DrawerBody>{children}</DrawerBody>
            <DrawerFooter
              borderTop="1px solid #E2E8F0"
              display="flex"
              flexDirection="column"
              mt="20px"
            >
              <SaveButton />
              <CancelButton />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Box borderBottom="1px solid #E2E8F0">
            <ModalHeader>
              <Text color="gray.900" fontSize="lg" fontWeight="bold">
                {title}
              </Text>
              <Text color="gray.600" fontSize="sm">
                {subTitle}
              </Text>
            </ModalHeader>
          </Box>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="20px">
            <CancelButton />
            <SaveButton />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

Overlay.defaultProps = {
  subTitle: '',
};

export default Overlay;
