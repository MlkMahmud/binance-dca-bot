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
  onEditFormOpen,
  onUpdate,
  symbol,
  timezone,
}) {
  const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
  const [isEditBtnLoading, setIsEditBtnLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleteBtnLoading(true);
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
        setIsDeleteBtnLoading(false);
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch {
      setIsDeleteBtnLoading(false);
      displayToast({
        description: 'Something went wrong, please try again',
        title: 'Error',
      });
    }
  };

  const handleUpdate = async () => {
    try {
      setIsEditBtnLoading(true);
      const payload = {};
      if (disabled) { payload.enable = true; } else { payload.disable = true; }
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { job, message: description } = await response.json();
      if (response.ok) {
        onUpdate(job, 'update');
        displayToast({
          description: 'Job updated successfully',
          status: 'success',
          title: 'Success',
        });
      } else {
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch {
      displayToast({
        description: 'Something went wrong, please try again',
        title: 'Error',
      });
    } finally { setIsEditBtnLoading(false); }
  };

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
            isDisabled={isDeleteBtnLoading || isEditBtnLoading}
            isLoading={isEditBtnLoading}
            minWidth="auto"
            onClick={handleUpdate}
          />
          <IconButton
            aria-label={`edit ${name}`}
            icon={<EditIcon />}
            isDisabled={isDeleteBtnLoading || isEditBtnLoading}
            minWidth="auto"
            onClick={() => onEditFormOpen(id)}
          />
          <IconButton
            aria-label={`delete ${name}`}
            icon={<DeleteIcon />}
            isDisabled={isDeleteBtnLoading || isEditBtnLoading}
            isLoading={isDeleteBtnLoading}
            minWidth="auto"
            onClick={handleDelete}
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
  onEditFormOpen: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
