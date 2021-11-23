import { Td, Th } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';

export default function TableCell({
  borderLeftColor,
  children,
  isFixed,
  isHeading,
}) {
  const Tag = isHeading ? Th : Td;
  // eslint-disable-next-line no-nested-ternary
  const zIndex = (isFixed && isHeading) ? 5 : isHeading ? 4 : isFixed ? 3 : 'auto';
  return (
    <Tag
      bgColor="#FFFFFF"
      borderLeft={(!isHeading && isFixed) ? `5px solid ${borderLeftColor}` : 'initial'}
      left={isFixed ? '0' : 'initial'}
      paddingY={isHeading ? '20px' : '1rem'}
      position={(isFixed || isHeading) ? 'sticky' : 'initial'}
      top={isHeading ? '0' : 'initial'}
      whiteSpace="nowrap"
      zIndex={zIndex}
    >
      {children}
    </Tag>
  );
}

TableCell.propTypes = {
  borderLeftColor: PropTypes.string,
  children: PropTypes.node.isRequired,
  isFixed: PropTypes.bool,
  isHeading: PropTypes.bool,
};

TableCell.defaultProps = {
  borderLeftColor: 'white',
  isFixed: false,
  isHeading: false,
};
