import React from 'react';
import {
  Icon,
  IconButton,
  Popover as ChakraPopover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { VscQuestion } from 'react-icons/vsc';
import PropTypes from 'prop-types';

export default function Popover({ children, title }) {
  return (
    <ChakraPopover isLazy>
      <PopoverTrigger>
        <IconButton
          icon={<Icon as={VscQuestion} />}
          minW="fit-content"
          variant="unstyled"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <Text fontWeight="extrabold">{title}</Text>
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverArrow />
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </ChakraPopover>
  );
}

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};
