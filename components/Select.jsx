import React from 'react';
import AsyncSelect from 'react-select/async';
import ReactSelect, { createFilter } from 'react-select';
import { Flex, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import List from 'react-tiny-virtual-list';

const HEIGHT = 35;

const styles = {
  control: (base) => ({
    ...base,
    border: '1px solid #E2E8F0',
    '&:hover': {
      border: '1px solid #CBD5E0',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 3,
  }),
};

function MenuList({
  children,
  getValue,
  isLoading,
  options,
}) {
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

  const renderItem = ({ index, style }) => (
    <div key={index} style={style}>
      {items[index]}
    </div>
  );

  return (
    <List
      height={HEIGHT * numberOfList + 6}
      scrollOffset={initialOffset}
      itemCount={children.length}
      itemSize={HEIGHT}
      renderItem={renderItem}
      width="100%"
    />
  );
}

const option = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

MenuList.propTypes = {
  children: PropTypes.node.isRequired,
  getValue: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(option).isRequired,
};

export default function Select({
  isAsync,
  getOptionLabel,
  getOptionValue,
  loadOptions,
  onChange,
  options,
  placeholder,
  value,
}) {
  if (isAsync) {
    return (
      <AsyncSelect
        cacheOptions
        components={{ MenuList }}
        defaultOptions
        filterOption={createFilter({ ignoreAccents: false })}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        loadOptions={loadOptions}
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
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      styles={styles}
      value={value}
    />
  );
}

Select.propTypes = {
  isAsync: PropTypes.bool,
  loadOptions: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(option).isRequired,
  placeholder: PropTypes.string,
  value: option.isRequired,
};

Select.defaultProps = {
  getOptionLabel: undefined,
  getOptionValue: undefined,
  isAsync: false,
  placeholder: '',
};
