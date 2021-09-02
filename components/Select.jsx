import React from 'react';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import List from 'react-tiny-virtual-list';

const HEIGHT = 35;

const styles = {
  control: (base) => ({
    ...base,
    border: '1px solid #E2E8F0',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 3,
  }),
};

function MenuList({
  children,
  getValue,
  options,
}) {
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * HEIGHT;
  const numberOfList = options.length < 10 ? options.length : 10;
  const items = React.Children.toArray(children);

  const renderItem = ({ index, style }) => (
    <div key={index} style={style}>{items[index]}</div>
  );

  return (
    <List
      height={(HEIGHT * numberOfList) + 6}
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
  options: PropTypes.arrayOf(option).isRequired,
};

export default function Select({ onChange, options, value }) {
  return (
    <ReactSelect
      components={{ MenuList }}
      filterOption={createFilter({ ignoreAccents: false })}
      onChange={onChange}
      options={options}
      styles={styles}
      value={value}
    />
  );
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(option).isRequired,
  value: option.isRequired,
};
