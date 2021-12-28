import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  RadioProps,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { User } from '../../types';
import Loading from '../Loading';
import Overlay from '../Overlay';

const DisablePasswordForm = dynamic(() => import('./DisablePasswordForm'), {
  loading: ({ error }) => <Loading error={error} />,
});
const EnablePasswordForm = dynamic(() => import('./EnablePasswordForm'), {
  loading: ({ error }) => <Loading error={error} />,
});
const UpdatePasswordForm = dynamic(() => import('./UpdatePasswordForm'), {
  loading: ({ error }) => <Loading error={error} />,
});

function Action(props: RadioProps & { description: string; title: string }) {
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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
  user: User;
};

export default function PasswordSettings({
  isOpen,
  onClose,
  onUpdate,
  user,
}: Props) {
  const router = useRouter();
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
      onClose={onClose}
      isLoading={isLoading}
      isOpen={isOpen}
      title="Security settings"
      footer={
        showActionScreen ? (
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
        ) : null
      }
    >
      {showActionScreen ? (
        <Stack spacing={4} {...group}>
          {!user.password.enabled && (
            <Action
              description="Turn on password protection"
              title="Enable password"
              {...getRadioProps({ value: 'enable' })}
            />
          )}
          {user.password.enabled && (
            <Action
              description="Turn off password protection"
              title="Disable password"
              {...getRadioProps({ value: 'disable' })}
            />
          )}
          {user.password.isSet && (
            <Action
              description="Update your current password"
              title="Update password"
              {...getRadioProps({ value: 'update' })}
            />
          )}
        </Stack>
      ) : (
        <>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => {
              if (!isLoading) {
                setShowActionScreen(true);
              }
            }}
            padding={0}
            size="lg"
            variant=""
          >
            Back
          </Button>
          <Box mt="10px">
            {action === 'enable' && (
              <EnablePasswordForm
                hasSetPassword={user.password.isSet}
                onUpdate={() => {
                  onUpdate({
                    ...user,
                    password: { enabled: true, isSet: true },
                  });
                  router.replace('/login');
                }}
                setIsLoading={setIsLoading}
              />
            )}
            {action === 'disable' && (
              <DisablePasswordForm
                onUpdate={() => {
                  onUpdate({
                    ...user,
                    password: { enabled: false, isSet: true },
                  });
                  onClose();
                }}
                setIsLoading={setIsLoading}
              />
            )}
            {action === 'update' && (
              <UpdatePasswordForm
                onUpdate={() => {
                  router.replace('/login');
                }}
                setIsLoading={setIsLoading}
              />
            )}
          </Box>
        </>
      )}
    </Overlay>
  );
}
