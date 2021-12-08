import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  destructive?: boolean;
  heading: string;
  isLoading: boolean;
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export default function Prompt({
  children,
  destructive,
  heading,
  isLoading,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={btnRef}
      motionPreset="slideInBottom"
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">{heading}</AlertDialogHeader>
        <AlertDialogBody>{children}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={btnRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            colorScheme={destructive ? 'red' : 'green'}
            ml={3}
            onClick={async () => {
              await onConfirm();
            }}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
