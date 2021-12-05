import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';


type Props = {
  id?: string;
  name?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  value: string;
}

export default function PasswordInput({
  id, name, onBlur, onChange, value,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
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
