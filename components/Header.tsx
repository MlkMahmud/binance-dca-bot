import { ButtonGroup, Flex, Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import { AiFillSetting } from "react-icons/ai";
import { FaLock, FaUnlock } from "react-icons/fa";
import Logo from "./Logo";

type Props = {
  isPasswordEnabled: boolean;
  onGlobalSettingsClick: () => void;
  onPasswordSettingsClick: () => void;
};

export default function Header({
  isPasswordEnabled,
  onGlobalSettingsClick,
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
