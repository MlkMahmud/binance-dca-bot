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
import { BsThreeDots } from 'react-icons/bs';
import { FaPause, FaPlay, FaTrashAlt } from 'react-icons/fa';

export default function Job({
  baseAsset, id, interval, isActive, name, quoteAsset,
}) {
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
            {isActive
              ? (<MenuItem icon={<Icon as={FaPause} />}>Pause Job</MenuItem>)
              : (<MenuItem icon={<Icon as={FaPlay} />}>Resume Job</MenuItem>)}
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
  baseAsset: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  isActive: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  quoteAsset: PropTypes.string.isRequired,
};
