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
import React from 'react';
import { useMediaQuery } from '../client-utils';

type Props = {
  children: React.ReactNode;
  formId: string;
  footer?: React.ReactNode;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  subTitle?: string;
  title: string;
};

const Overlay = React.forwardRef<HTMLButtonElement, Props>(
  (
    { children, formId, footer, isLoading, isOpen, onClose, subTitle, title },
    ref
  ) => {
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
        <Button colorScheme="red" isFullWidth onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    );

    if (isMobile) {
      return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
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
            <DrawerFooter borderTop="1px solid #E2E8F0" mt="20px">
              {footerContent}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
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
            {footerContent}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

Overlay.displayName = 'Overlay';

export default Overlay;
