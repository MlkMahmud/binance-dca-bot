/* eslint-disable react/no-unescaped-entities */
import {
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FaSlack, FaTelegramPlane } from 'react-icons/fa';
import Overlay from './Overlay';
import Popover from './Popover';
import Select from './Select';
import { generateSelectOption } from '../utils';
import timezones from '../data/timezones.json';

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
      subTitle="Edit your global timezone and notification settings here."
      title="Settings"
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
                          <Popover title="Default timezone">
                            Unless otherwise specified, this is the timezone
                            used when scheduling your jobs.
                          </Popover>
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
                          <Popover title="Slack notifications">
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
                          </Popover>
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
                            <Popover title="Telegram Notifications">
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
                            </Popover>
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
                            <Popover title="Telegram Notifications">
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
                            </Popover>
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
