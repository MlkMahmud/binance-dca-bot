//@ts-nocheck
import React from 'react';
import AsyncSelect from 'react-select/async';
import ReactSelect, { createFilter } from 'react-select';
import { Flex, Text } from '@chakra-ui/react';
import List from 'react-tiny-virtual-list';

const HEIGHT = 35;

const styles = {
  control: (base: any) => ({
    ...base,
    border: '1px solid #E2E8F0',
    '&:hover': {
      border: '1px solid #CBD5E0',
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 3,
  }),
};

type MenuListProps = {
  children: React.ReactNode;
  getValue: () => any[];
  isLoading: boolean;
  options: any[];
};

function MenuList({ children, getValue, isLoading, options }: MenuListProps) {
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * HEIGHT;
  const numberOfList = options.length < 10 ? options.length : 10;
  const items = React.Children.toArray(children);

  if (isLoading) {
    return (
      <Flex align="center" height="100px" justify="center" width="100%">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (options.length < 1) {
    return (
      <Flex align="center" height="100px" justify="center" width="100%">
        <Text>No Options</Text>
      </Flex>
    );
  }

  const renderItem = ({ index, style }: { index: number; style: any }) => (
    <div key={index} style={style}>
      {items[index]}
    </div>
  );

  return (
    <List
      height={HEIGHT * numberOfList + 6}
      scrollOffset={initialOffset}
      itemCount={React.Children.toArray(children).length}
      itemSize={HEIGHT}
      renderItem={renderItem}
      width="100%"
    />
  );
}

type Props = {
  inputId?: string;
  isAsync?: boolean;
  isDisabled?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
  loadOptions?: any;
  name?: string;
  onChange: (option: any) => void;
  options?: any[];
  placeholder?: string;
  value: any;
};

export default function Select({
  inputId = '',
  isAsync,
  isDisabled = false,
  getOptionLabel,
  getOptionValue,
  loadOptions,
  name = '',
  onChange,
  options,
  placeholder,
  value,
}: Props) {
  if (isAsync) {
    return (
      <AsyncSelect
        cacheOptions
        components={{ MenuList }}
        defaultOptions
        filterOption={createFilter({ ignoreAccents: false })}
        inputId={inputId}
        isDisabled={isDisabled}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        loadOptions={loadOptions}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        styles={styles}
        value={value}
      />
    );
  }
  return (
    <ReactSelect
      components={{ MenuList }}
      filterOption={createFilter({ ignoreAccents: false })}
      inputId={inputId}
      isDisabled={isDisabled}
      name={name}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      styles={styles}
      value={value}
    />
  );
}
