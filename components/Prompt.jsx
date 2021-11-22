import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';

const Prompt = React.forwardRef(({
  children,
  destructive,
  heading,
  isOpen,
  onClose,
  onConfirm,
}, ref) => (
  <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={ref}
    onClose={onClose}
  >
    <AlertDialogOverlay />
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">{heading}</AlertDialogHeader>
      <AlertDialogBody>{children}</AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={ref} onClick={onClose}>
          Cancel
        </Button>
        <Button
          colorScheme={destructive ? 'red' : 'green'}
          ml={3}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
));

Prompt.defaultProps = {
  destructive: false,
};

Prompt.propTypes = {
  children: PropTypes.node.isRequired,
  destructive: PropTypes.bool,
  heading: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
