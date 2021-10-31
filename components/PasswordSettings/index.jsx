/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Overlay from '../Overlay';
import EnablePasswordForm from './EnablePasswordForm';

const actions = [
  { title: 'Enable password', description: 'Turn on password protection', value: 'enable' },
  { title: 'Disable password', description: 'Turn off password protection', value: 'disable' },
  { title: 'Update password', description: 'Update your current password', value: 'update' },
];

function Action(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Stack align="center" isInline spacing={4} {...checkbox}>
        <Icon
          as={CheckCircleIcon}
          color={props.isChecked ? 'black.800' : 'gray.200'}
        />
        <Box>
          <Text color="gray.700" fontSize="md" fontWeight="medium">
            {props.title}
          </Text>
          <Text color="gray.500" fontSize="sm" fontWeight="small">
            {props.description}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

export default function PasswordSettings({ isOpen, onClose, user }) {
  const [showActionScreen, setShowActionScreen] = useState(true);
  const [action, setAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'action',
    onChange: (value) => setAction(value),
  });
  const group = getRootProps();

  return (
    <Overlay
      formId={action}
      handleClose={onClose}
      isLoading={isLoading}
      isOpen={isOpen}
      title="Security settings"
      footer={showActionScreen ? (
        <Button
          colorScheme="black"
          isDisabled={!action}
          isFullWidth
          onClick={() => {
            setShowActionScreen(false);
          }}
        >
          Next
        </Button>
      ) : null}
    >
      {showActionScreen ? (
        <Stack spacing={4} {...group}>
          {actions.map(({ title, description, value }) => {
            const radio = getRadioProps({ value });
            return (
              <Action
                description={description}
                key={value}
                title={title}
                {...radio}
              />
            );
          })}
        </Stack>
      ) : (
        <>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => setShowActionScreen(true)}
            padding={0}
            size="lg"
            variant=""
          >
            Back
          </Button>
          <Box mt="10px">
            <EnablePasswordForm
              hasSetPassword={user.password.isSet}
              setIsLoading={setIsLoading}
            />
          </Box>
        </>
      )}
    </Overlay>
  );
}

PasswordSettings.propTypes = {
  user: PropTypes.shape().isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
