import {
  HamburgerIcon,
  LockIcon,
  SettingsIcon,
  UnlockIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { MdLogout } from 'react-icons/md';
import Logo from './Logo';

type Props = {
  isPasswordEnabled: boolean;
  onGlobalSettingsClick: () => void;
  onLogoutSuccess: () => void;
  onPasswordSettingsClick: () => void;
};

export default function Header({
  isPasswordEnabled,
  onGlobalSettingsClick,
  onLogoutSuccess,
  onPasswordSettingsClick,
}: Props) {
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
      <Menu>
        <MenuButton
          aria-label="main menu"
          as={IconButton}
          icon={<HamburgerIcon boxSize="25px" />}
          minW="auto"
          variant="unstyled"
        />
        <MenuList>
          <MenuItem icon={<SettingsIcon />} onClick={onGlobalSettingsClick}>
            General settings
          </MenuItem>
          <MenuItem
            icon={isPasswordEnabled ? <LockIcon /> : <UnlockIcon />}
            onClick={onPasswordSettingsClick}
          >
            Password settings
          </MenuItem>
          {isPasswordEnabled && (
            <MenuItem icon={<Icon as={MdLogout} />} onClick={onLogoutSuccess}>
              Logout
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
