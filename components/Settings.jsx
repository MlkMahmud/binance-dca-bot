/* eslint-disable react/no-unescaped-entities */
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
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FaSlack, FaTelegramPlane } from 'react-icons/fa';
import { VscQuestion } from 'react-icons/vsc';
import Select from './Select';
import { generateSelectOption, useMediaQuery } from '../utils';

function Info({ children, title }) {
  return (
    <Popover isLazy>
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
    </Popover>
  );
}

Info.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

const Overlay = React.forwardRef(
  ({
    children, handleClose, isLoading, isOpen,
  }, ref) => {
    const isMobile = useMediaQuery('(max-width: 600px)');

    const SaveButton = () => (
      <Button
        colorScheme="black"
        form="settings"
        isFullWidth={isMobile}
        isLoading={isLoading}
        mb={isMobile ? '10px' : 0}
        ref={ref}
        type="submit"
      >
        Save
      </Button>
    );

    const CancelButton = () => (
      <Button
        colorScheme="red"
        isFullWidth={isMobile}
        mr={isMobile ? '0' : '10px'}
        onClick={handleClose}
      >
        Cancel
      </Button>
    );

    if (isMobile) {
      return (
        <Drawer
          isOpen={isOpen}
          onClose={handleClose}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent>
            <Box borderBottom="1px solid #E2E8F0">
              <DrawerHeader>
                <Text color="gray.900" fontSize="lg" fontWeight="bold">
                  Settings
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Edit your global timezone and notification settings here.
                </Text>
              </DrawerHeader>
            </Box>
            <DrawerCloseButton />
            <DrawerBody>{children}</DrawerBody>
            <DrawerFooter
              borderTop="1px solid #E2E8F0"
              display="flex"
              flexDirection="column"
              mt="20px"
            >
              <SaveButton />
              <CancelButton />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Box borderBottom="1px solid #E2E8F0">
            <ModalHeader>
              <Text color="gray.900" fontSize="lg" fontWeight="bold">
                Settings
              </Text>
              <Text color="gray.600" fontSize="sm">
                Edit your global timezone and notification settings here.
              </Text>
            </ModalHeader>
          </Box>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="20px">
            <CancelButton />
            <SaveButton />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const timezones = [
  'Africa/Lagos',
  'Africa/Accra',
  'Europe/London',
  'Asia/Tokyo',
];

export default function Settings({
  handleClose,
  handleUpdate,
  initialValues,
  isOpen,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useRef();

  const onSubmit = async (values) => {
    setIsLoading(true);
    const sleep = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
    await sleep();
    handleUpdate(values);
    handleClose();
  };

  return (
    <Overlay
      isLoading={isLoading}
      isOpen={isOpen}
      handleClose={() => {
        if (!isLoading) {
          handleClose();
        }
      }}
      ref={btnRef}
    >
      <Form
        initialValues={initialValues}
        mutators={{
          updateTimezone([value], state, { changeValue }) {
            changeValue(state, 'timezone', () => value);
          },
        }}
        onSubmit={onSubmit}
      >
        {({
          form, handleSubmit, pristine, values,
        }) => {
          if (btnRef.current) {
            if (pristine) {
              btnRef.current.disabled = true;
            } else {
              btnRef.current.disabled = false;
            }
          }
          return (
            <form id="settings" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Field name="timezone">
                  {() => (
                    <FormControl id="timezone">
                      <FormLabel mb="0">
                        <Stack align="center" isInline spacing={1}>
                          <Text fontSize="17px" fontWeight="bold">
                            Timezone
                          </Text>
                          <Info title="Default timezone">
                            Unless otherwise specified, this is the timezone
                            used when scheduling your jobs.
                          </Info>
                        </Stack>
                      </FormLabel>
                      <Select
                        onChange={({ value }) => form.mutators.updateTimezone(value)}
                        options={timezones.map((timezone) => generateSelectOption(timezone))}
                        value={generateSelectOption(values.timezone)}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="slack">
                  {({ input }) => (
                    <FormControl id="slack">
                      <FormLabel mb="0">
                        <Stack align="center" isInline spacing={1}>
                          <Text fontSize="17px" fontWeight="bold">
                            Slack
                          </Text>
                          <Info title="Slack notifications">
                            Your Slack webhook is used to send you updates about
                            your jobs.
                            {' '}
                            <Text fontWeight="bold">
                              If you'd like to disable this feature, clear this
                              field and save your changes.
                            </Text>
                            {' '}
                            To learn more about Slack's incoming webhooks, click
                            {' '}
                            <Link
                              color="blue.500"
                              href="https://api.slack.com/messaging/webhooks"
                              isExternal
                            >
                              here
                            </Link>
                          </Info>
                        </Stack>
                      </FormLabel>
                      <InputGroup>
                        <InputRightElement pointerEvents="none">
                          <Icon as={FaSlack} boxSize="25px" />
                        </InputRightElement>
                        <Input
                          name={input.name}
                          onChange={input.onChange}
                          value={input.value}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Stack direction={['column', 'row']} spacing={3}>
                  <Field name="telegramBotToken">
                    {({ input }) => (
                      <FormControl>
                        <FormLabel mb="0">
                          <Stack align="center" isInline spacing={1}>
                            <Text fontSize="17px" fontWeight="bold">
                              Telegram bot token
                            </Text>
                            <Info title="Telegram Notifications">
                              Your Telegam bot token is used in tandem with your
                              Telegam chatId to send you updates about your
                              jobs.
                              {' '}
                              <Text fontWeight="bold">
                                If you'd like to disable this feature, clear
                                this field and save your changes.
                              </Text>
                              {' '}
                              To learn more about Telegram bots, click
                              {' '}
                              <Link
                                color="blue.500"
                                href="https://dev.to/rizkyrajitha/get-notifications-with-telegram-bot-537l"
                                isExternal
                              >
                                here
                              </Link>
                            </Info>
                          </Stack>
                        </FormLabel>
                        <InputGroup>
                          <InputRightElement pointerEvents="none">
                            <Icon as={FaTelegramPlane} boxSize="25px" />
                          </InputRightElement>
                          <Input
                            name={input.name}
                            onChange={input.onChange}
                            value={input.value}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="telegramChatId">
                    {({ input }) => (
                      <FormControl>
                        <FormLabel mb="0">
                          <Stack align="center" isInline spacing={1}>
                            <Text fontSize="17px" fontWeight="bold">
                              Telegram chatId
                            </Text>
                            <Info title="Telegram Notifications">
                              Your Telegam chatId is used in tandem with your
                              Telegam bot token to send you updates about your
                              jobs.
                              {' '}
                              <Text fontWeight="bold">
                                If you'd like to disable this feature, clear
                                this field and save your changes.
                              </Text>
                              {' '}
                              To learn more about Telegram bots, click
                              {' '}
                              <Link
                                color="blue.500"
                                href="https://dev.to/rizkyrajitha/get-notifications-with-telegram-bot-537l"
                                isExternal
                              >
                                here
                              </Link>
                            </Info>
                          </Stack>
                        </FormLabel>
                        <InputGroup>
                          <InputRightElement pointerEvents="none">
                            <Icon as={FaTelegramPlane} boxSize="25px" />
                          </InputRightElement>
                          <Input
                            name={input.name}
                            onChange={input.onChange}
                            value={input.value}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </Stack>
            </form>
          );
        }}
      </Form>
    </Overlay>
  );
}

Settings.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    slack: PropTypes.string,
    telegramBotToken: PropTypes.string,
    telegramChatId: PropTypes.string,
    timezone: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
};
