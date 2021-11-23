/* eslint-env browser */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  createIcon,
  IconButton,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import TableCell from '../TableCell';

const PauseIcon = createIcon({
  displayName: 'PauseIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      clipRule="evenodd"
      d="M10 19H6V5h4v14zm4 0V5h4v14h-4z"
      fill="currentColor"
      fillRule="evenodd"
    />
  ),
});

const PlayIcon = createIcon({
  displayName: 'PlayIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      clipRule="evenodd"
      d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm14 0l-6-4.5v9l6-4.5z"
      fill="currentColor"
      fillRule="evenodd"
    />
  ),
});

export default function Job({
  amount,
  disabled,
  id,
  interval,
  lastRun,
  name,
  nextRun,
  onConfirm,
  onEditFormOpen,
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
            aria-label={`${disabled ? 'resume' : 'pause'} ${name}`}
            icon={disabled ? <PlayIcon /> : <PauseIcon />}
            minWidth="auto"
            onClick={() => onConfirm(id, 'update')}
          />
          <IconButton
            aria-label={`edit ${name}`}
            icon={<EditIcon />}
            minWidth="auto"
            onClick={() => onEditFormOpen(id)}
          />
          <IconButton
            aria-label={`delete ${name}`}
            icon={<DeleteIcon />}
            minWidth="auto"
            onClick={() => onConfirm(id, 'delete')}
          />
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
  onConfirm: PropTypes.func.isRequired,
  onEditFormOpen: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
