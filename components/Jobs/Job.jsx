import React from 'react';
import {
  Box,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { AiFillEdit } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';

export default function Job({ onEdit, job }) {
  const {
    baseAsset, id, interval, isActive, name, quoteAsset,
  } = job;
  const borderColor = isActive ? '#5EDC1F' : '#FF2400';

  return (
    <Box
      borderRadius="5px"
      borderTop={`5px solid ${borderColor}`}
      p="10px"
      shadow="0 2px 5px 1px rgb(64 60 67 / 16%)"
    >

      <Stack align="center" isInline justify="space-between" mb="5px">
        <Text fontSize="lg">{name}</Text>
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
              icon={<Icon as={AiFillEdit} />}
              onClick={onEdit}
            >
              Edit Job
            </MenuItem>
            <MenuItem icon={<Icon as={FaTrashAlt} />}>Delete Job</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
      <Stack isInline mb="20px" spacing={10}>
        <Box>
          <Text color="#778899" fontSize="sm">Base asset</Text>
          <Text fontSize="md">{baseAsset}</Text>
        </Box>
        <Box>
          <Text color="#778899" fontSize="sm">Quote asset</Text>
          <Text fontSize="md">{quoteAsset}</Text>
        </Box>
        <Box>
          <Text color="#778899" fontSize="sm">Interval</Text>
          <Text fontSize="md">{interval}</Text>
        </Box>
      </Stack>
      <Link
        color="blue.600"
        href={`/jobs/${id}`}
        textDecor="underline"
      >
        View job details
      </Link>
    </Box>
  );
}

Job.propTypes = {
  onEdit: PropTypes.func.isRequired,
  job: PropTypes.shape().isRequired,
};
