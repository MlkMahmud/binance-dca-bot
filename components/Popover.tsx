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

type Props = {
  children: React.ReactNode;
  title: string; 
}

export default function Popover({ children, title }: Props) {
  return (
    <ChakraPopover isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label={`${title} popover`}
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
