import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  isOpen: boolean;
  jobId: string;
  jobName: string;
  onClose: () => void;
};

export default function OrderHistory({ isOpen, jobId, jobName, onClose }: Props) {
  return (
    <Drawer
      isOpen={isOpen}
      isFullHeight
      onClose={onClose}
      placement="left"
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <Box borderBottom="1px solid #E2E8F0">
          <DrawerHeader>
            <Text color="gray.900" fontSize="lg" fontWeight="bold">
              Order history
            </Text>
            <Text color="gray.600" fontSize="sm">
              {jobName}
            </Text>
          </DrawerHeader>
        </Box>
        <DrawerBody>
          <Text>Add Text Here for Job ${jobId}</Text>
        </DrawerBody>
        <DrawerFooter>This is footer stuff</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
