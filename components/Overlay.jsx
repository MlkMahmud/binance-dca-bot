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
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '../utils';

const Overlay = React.forwardRef(
  ({
    children,
    handleClose,
    formId,
    footer,
    isLoading,
    isOpen,
    subTitle,
    title,
  }, ref) => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const footerContent = footer || (
      <Stack spacing={2} width="100%">
        <Button
          colorScheme="black"
          form={formId}
          isFullWidth
          isLoading={isLoading}
          ref={ref}
          type="submit"
        >
          Save
        </Button>
        <Button
          colorScheme="red"
          isFullWidth
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Stack>
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
              mt="20px"
            >
              {footerContent}
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
          <ModalFooter
            borderTop="1px solid #E2E8F0"
            mt="20px"
          >
            {footerContent}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  footer: PropTypes.node,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

Overlay.defaultProps = {
  footer: null,
  subTitle: '',
};

export default Overlay;
