import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  IconButton,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import TableCell from '../TableCell';

export default function Job({
  amount,
  disabled,
  id,
  interval,
  lastRun,
  name,
  nextRun,
  onEdit,
  symbol,
  timezone,
}) {
  return (
    <Tr>
      <TableCell
        isFixed
        isDisabled={disabled}
      >
        {name}
      </TableCell>
      <TableCell>{symbol}</TableCell>
      <TableCell>{amount}</TableCell>
      <TableCell>{interval}</TableCell>
      <TableCell>{timezone}</TableCell>
      <TableCell>{lastRun}</TableCell>
      <TableCell>{nextRun}</TableCell>
      <TableCell>
        <ButtonGroup variant="unstyled">
          <IconButton
            aria-label={`delete ${name} job`}
            icon={<EditIcon />}
            minWidth="auto"
            onClick={() => onEdit(id)}
          />
          <IconButton icon={<DeleteIcon />} minWidth="auto" />
        </ButtonGroup>
      </TableCell>
    </Tr>
  );
}

Job.propTypes = {
  amount: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  lastRun: PropTypes.oneOf(PropTypes.instanceOf(Date), PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  nextRun: PropTypes.oneOf(PropTypes.instanceOf(Date), PropTypes.string).isRequired,
  onEdit: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
