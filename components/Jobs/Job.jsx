/* eslint-env browser */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  createIcon,
  IconButton,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { displayToast } from '../../utils';
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
  onDelete,
  onEdit,
  symbol,
  timezone,
}) {
  const [isLoading, setIsLoading] = useState(false);
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
            icon={disabled ? <PlayIcon /> : <PauseIcon />}
            minWidth="auto"
          />
          <IconButton
            aria-label={`delete ${name} job`}
            icon={<EditIcon />}
            minWidth="auto"
            onClick={() => onEdit(id)}
          />
          <IconButton
            icon={<DeleteIcon />}
            isLoading={isLoading}
            minWidth="auto"
            onClick={async () => {
              try {
                setIsLoading(true);
                const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
                const { message: description } = await response.json();
                if (response.ok) {
                  onDelete(id);
                  displayToast({
                    description,
                    status: 'success',
                    title: 'Success',
                  });
                } else {
                  setIsLoading(false);
                  displayToast({
                    description,
                    title: 'Error',
                  });
                }
              } catch (e) {
                setIsLoading(false);
                displayToast({
                  description: 'Something went wrong, please try again',
                  title: 'Error',
                });
              }
            }}
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
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
