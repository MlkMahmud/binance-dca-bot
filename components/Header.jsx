import {
  Icon,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { AiFillSetting } from 'react-icons/ai';
import Logo from './Logo';

export default function Header({ handleClick }) {
  return (
    <Flex
      align="center"
      as="header"
      justify="space-between"
      px={[2, 5]}
      py={[2, 3]}
      shadow="rgb(0 0 0 / 25%) 0px 2px 2px 2px"
    >
      <Logo />
      <IconButton
        aria-label="settings"
        variant="unstyled"
        icon={<Icon as={AiFillSetting} boxSize="30px" />}
        onClick={handleClick}
      />
    </Flex>
  );
}

Header.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
