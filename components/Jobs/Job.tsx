import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  createIcon,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import TableCell from '../TableCell';

const HistoryIcon = createIcon({
  displayName: 'HistoryIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      clipRule="evenodd"
      d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6Zm2 10H8v2h8v-2Zm0 4H8v2h8v-2ZM6 20h12V9h-5V4H6v16Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  ),
});

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

type JobCardProps = {
  children: React.ReactNode;
  isVertical?: boolean;
  title: string;
};

function JobCard({ children, isVertical = false, title }: JobCardProps) {
  return (
    <Stack
      align={isVertical ? 'initial' : 'center'}
      className="job_card"
      isInline={!isVertical}
      justify={isVertical ? 'initial' : 'space-between'}
      p="10px"
      spacing={isVertical ? 1 : 0}
      textTransform="capitalize"
    >
      <Text fontSize="sm" fontWeight="bold">
        {title}
      </Text>
      <Text fontSize="sm" fontWeight="semibold">
        {children}
      </Text>
    </Stack>
  );
}

type Props = {
  amount: string;
  disabled: boolean;
  id: string;
  interval: string;
  isMobile: boolean;
  lastRun: Date | null;
  name: string;
  nextRun: Date;
  onButtonClick: (
    jobId: string,
    op: 'delete' | 'edit' | 'status' | 'history'
  ) => void;
  symbol: string;
  timezone: string;
};

export default function Job({
  amount,
  disabled,
  id,
  interval,
  isMobile,
  lastRun,
  name,
  nextRun,
  onButtonClick,
  symbol,
  timezone,
}: Props) {
  const borderColor = disabled ? '#FF2400' : '#5EDC1F';
  if (isMobile) {
    return (
      <Stack
        borderRadius="5px"
        borderTop={`5px solid ${borderColor}`}
        mb="20px"
        p="10px"
        shadow="0 2px 5px 1px rgb(64 60 67 / 16%)"
        spacing={2}
        width="100%"
      >
        <Stack align="center" isInline justify="space-between" px="10px">
          <Text fontSize="md" fontWeight="bold">
            {name}
          </Text>
          <Menu isLazy>
            <MenuButton
              aria-label="options"
              as={IconButton}
              icon={<Icon as={BsThreeDots} />}
              minW="auto"
              variant="unstyled"
            />
            <MenuList>
              <MenuItem
                icon={disabled ? <PlayIcon /> : <PauseIcon />}
                onClick={() => onButtonClick(id, 'status')}
              >
                {`${disabled ? 'Resume' : 'Pause'} job`}
              </MenuItem>
              <MenuItem
                icon={<EditIcon />}
                onClick={() => onButtonClick(id, 'edit')}
              >
                Edit job
              </MenuItem>
              <MenuItem
                icon={<DeleteIcon />}
                onClick={() => onButtonClick(id, 'delete')}
              >
                Delete job
              </MenuItem>
              <MenuItem
                icon={<HistoryIcon />}
                onClick={() => onButtonClick(id, 'history')}
              >
                View order history
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
        <Stack
          css={{
            '.job_card:nth-of-type(odd)': {
              backgroundColor: '#F5F5F5',
            },
          }}
          spacing={1}
        >
          <JobCard title="symbol">{symbol}</JobCard>
          <JobCard title="amount">{amount}</JobCard>
          <JobCard title="timezone">{timezone}</JobCard>
          <JobCard isVertical title="interval">
            {interval}
          </JobCard>
          <JobCard isVertical title="last run">
            {lastRun && new Date(`${lastRun}`).toLocaleString('en-GB') || '---'}
          </JobCard>
          <JobCard isVertical title="next run">
            {new Date(`${nextRun}`).toLocaleString('en-GB')}
          </JobCard>
        </Stack>
      </Stack>
    );
  }
  return (
    <Tr>
      <TableCell borderLeftColor={borderColor} isFixed>
        {name}
      </TableCell>
      <TableCell>{symbol}</TableCell>
      <TableCell>{amount}</TableCell>
      <TableCell>{interval}</TableCell>
      <TableCell>{timezone}</TableCell>
      <TableCell>{lastRun && new Date(`${lastRun}`).toLocaleString('en-GB') || '---'}</TableCell>
      <TableCell>{new Date(`${nextRun}`).toLocaleString('en-GB')}</TableCell>
      <TableCell>
        <ButtonGroup variant="unstyled">
          <IconButton
            aria-label={`${disabled ? 'resume' : 'pause'} ${name}`}
            icon={disabled ? <PlayIcon /> : <PauseIcon />}
            minWidth="auto"
            onClick={() => onButtonClick(id, 'status')}
          />
          <IconButton
            aria-label={`edit ${name}`}
            icon={<EditIcon />}
            minWidth="auto"
            onClick={() => onButtonClick(id, 'edit')}
          />
          <IconButton
            aria-label={`delete ${name}`}
            icon={<DeleteIcon />}
            minWidth="auto"
            onClick={() => onButtonClick(id, 'delete')}
          />
          <IconButton
            aria-label={`view ${name} history`}
            icon={<HistoryIcon />}
            minWidth="auto"
            onClick={() => onButtonClick(id, 'history')}
          />
        </ButtonGroup>
      </TableCell>
    </Tr>
  );
}
