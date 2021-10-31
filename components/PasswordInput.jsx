import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  IconButton, Input, InputGroup, InputRightElement,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

export default function PasswordInput({
  id, name, onBlur, onChange, value,
}) {
  const [showPassword, setShowPassword] = useState();
  return (
    <InputGroup>
      <Input
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
        value={value}
      />
      <InputRightElement>
        <IconButton
          aria-label="toggle password visibility"
          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
          onClick={() => setShowPassword(!showPassword)}
          variant="unstyled"
        />
      </InputRightElement>
    </InputGroup>
  );
}

PasswordInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

PasswordInput.defaultProps = {
  id: '',
  name: '',
  onBlur: () => {},
  onChange: () => {},
  value: '',
};
