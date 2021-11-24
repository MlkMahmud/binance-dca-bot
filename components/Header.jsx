import {
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { FaLock, FaUnlock } from 'react-icons/fa';
import Logo from './Logo';

export default function Header({
  isPasswordEnabled,
  onGlobalSettingsClick,
  onPasswordSettingsClick,
}) {
  return (
    <Flex
      align="center"
      as="header"
      bgColor="#FFF"
      justify="space-between"
      left="0"
      position="sticky"
      px={[2, 5]}
      py={[2, 3]}
      shadow="rgb(0 0 0 / 25%) 0px 2px 2px 2px"
      top="0"
      zIndex={6}
    >
      <Logo />
      <ButtonGroup>
        <IconButton
          aria-label="settings"
          variant="unstyled"
          icon={<Icon as={AiFillSetting} boxSize="25px" />}
          minW="auto"
          onClick={onGlobalSettingsClick}
        />
        <IconButton
          aria-label="settings"
          variant="unstyled"
          icon={
            <Icon as={isPasswordEnabled ? FaLock : FaUnlock} boxSize="25px" />
          }
          minW="auto"
          onClick={onPasswordSettingsClick}
        />
      </ButtonGroup>
    </Flex>
  );
}

Header.propTypes = {
  isPasswordEnabled: PropTypes.bool.isRequired,
  onGlobalSettingsClick: PropTypes.func.isRequired,
  onPasswordSettingsClick: PropTypes.func.isRequired,
};
