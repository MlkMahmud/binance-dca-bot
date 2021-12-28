import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { displayToast } from '../../client-utils';
import PasswordInput from '../PasswordInput';

type Props = {
  onUpdate: () => void;
  setIsLoading: (isLoading: boolean) => void;
};

type Values = {
  password: string;
};

export default function DisablePasswordForm({ onUpdate, setIsLoading }: Props) {
  const onSubmit = async (values: Values) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/password', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const { message: description } = await response.json();
      if (response.ok) {
        displayToast({
          description,
          status: 'success',
          title: 'Success',
        });
        onUpdate();
      } else {
        setIsLoading(false);
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

  const validate = ({ password }: Values) => {
    const errors: Partial<Values> = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    return errors;
  };

  return (
    <>
      <Stack mb="20px">
        <Text fontSize="xl" fontWeight="semibold">
          Disable password protection
        </Text>
        <Text colorScheme="gray.600" fontWeight="normal">
          You must confirm your password to disable the password protection
          feature
        </Text>
      </Stack>
      <Form
        initialValues={{
          action: 'disable',
          password: '',
        }}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <form
            aria-label="disable password"
            id="disable"
            onSubmit={handleSubmit}
          >
            <Field name="password">
              {({ input, meta }) => (
                <FormControl
                  id="password"
                  isInvalid={meta.error && meta.touched}
                >
                  <FormLabel>Password: </FormLabel>
                  <PasswordInput
                    name={input.name}
                    onBlur={input.onBlur}
                    onChange={input.onChange}
                    value={input.value}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </form>
        )}
      </Form>
    </>
  );
}
