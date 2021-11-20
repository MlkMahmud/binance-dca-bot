import { Td, Th } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';

export default function TableCell({
  children,
  isDisabled,
  isFixed,
  isHeading,
}) {
  const Tag = isHeading ? Th : Td;
  return (
    <Tag
      bgColor="#FFFFFF"
      borderLeft={(!isHeading && isFixed) ? `5px solid ${isDisabled ? '#FF2400' : '#5EDC1F'}` : 'initial'}
      left={isFixed ? '0' : 'initial'}
      position={isFixed ? 'sticky' : 'initial'}
      top={isHeading ? '0' : ''}
      whiteSpace="nowrap"
      zIndex={(isFixed || isHeading) ? 3 : 'auto'}
    >
      {children}
    </Tag>
  );
}

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  isDisabled: PropTypes.bool,
  isFixed: PropTypes.bool,
  isHeading: PropTypes.bool,
};

TableCell.defaultProps = {
  isDisabled: false,
  isFixed: false,
  isHeading: false,
};
