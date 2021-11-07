/* eslint-disable react/no-unescaped-entities */
/* eslint-env browser */
import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FaSlack, FaTelegramPlane } from 'react-icons/fa';
import Overlay from './Overlay';
import Popover from './Popover';
import Select from './Select';
import { displayToast, generateSelectOption } from '../utils';

export default function Settings({
  onClose,
  onUpdate,
  initialValues,
  isOpen,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useRef();

  const onSubmit = async ({ timezone, slack, telegram }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ timezone, slack, telegram }),
      });
      const { user, message: description } = await response.json();
      if (response.ok) {
        displayToast({
          description: 'Settings updated',
          status: 'success',
          title: 'Success',
        });
        onUpdate(user);
        onClose();
      } else {
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch (e) {
      setIsLoading(false);
      displayToast({
        description: 'Something went wrong, please try again.',
        title: 'Error',
      });
    }
  };

  return (
    <Overlay
      isLoading={isLoading}
      isOpen={isOpen}
      formId="settings"
      onClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
      ref={btnRef}
      subTitle="Edit your global timezone and notification settings here."
      title="Settings"
    >
      <Form
        initialValues={initialValues}
        mutators={{
          enableSlack([value], state, { changeValue }) {
            changeValue(state, 'slack.enabled', () => value);
          },
          enableTelegram([value], state, { changeValue }) {
            changeValue(state, 'telegram.enabled', () => value);
          },
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
                <Box>
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
                          isAsync
                          loadOptions={async (query) => {
                            const response = await fetch(
                              `/api/timezones?q=${query}`,
                            );
                            if (response.ok) {
                              const timezones = await response.json();
                              return timezones;
                            }
                            return [];
                          }}
                          onChange={({ value }) => form.mutators.updateTimezone(value)}
                          value={generateSelectOption(values.timezone)}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="slack.url">
                    {({ input }) => (
                      <FormControl id="slackUrl">
                        <FormLabel mb="0">
                          <Stack align="center" isInline spacing={1}>
                            <Text fontSize="17px" fontWeight="bold">
                              Slack
                            </Text>
                            <Popover title="Slack notifications">
                              Your Slack webhook is used to send you updates about
                              your jobs.
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
                            isDisabled={!values.slack.enabled}
                            name={input.name}
                            onBlur={input.onBlur}
                            onChange={input.onChange}
                            value={input.value}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="slack.enabled">
                    {() => (
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        mt="0.5rem"
                      >
                        Enable Slack Notifications ?
                        {'  '}
                        <Switch
                          isChecked={values.slack.enabled}
                          onChange={({ target }) => form.mutators.enableSlack(target.checked)}
                        />
                      </Text>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Stack direction={['column', 'row']} spacing={3}>
                    <Field name="telegram.botToken">
                      {({ input }) => (
                        <FormControl id="botToken">
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
                              isDisabled={!values.telegram.enabled}
                              name={input.name}
                              onBlur={input.onBlur}
                              onChange={input.onChange}
                              value={input.value}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="telegram.chatId">
                      {({ input }) => (
                        <FormControl id="chatId">
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
                              isDisabled={!values.telegram.enabled}
                              name={input.name}
                              onBlur={input.onBlur}
                              onChange={input.onChange}
                              value={input.value}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Field name="telegram.enabled">
                    {() => (
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        mt="0.5rem"
                      >
                        Enable Telegram Notifications ?
                        {'  '}
                        <Switch
                          isChecked={values.telegram.enabled}
                          onChange={({ target }) => form.mutators.enableTelegram(target.checked)}
                        />
                      </Text>
                    )}
                  </Field>
                </Box>
              </Stack>
            </form>
          );
        }}
      </Form>
    </Overlay>
  );
}

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    slack: PropTypes.string,
    telegramBotToken: PropTypes.string,
    telegramChatId: PropTypes.string,
    timezone: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
};
