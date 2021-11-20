import React from 'react';
import {
  // Box,
  // Icon,
  // IconButton,
  // Link,
  // Menu,
  // MenuButton,
  // MenuItem,
  // MenuList,
  // Stack,
  // Text,
  // Td,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
// import { AiFillEdit } from 'react-icons/ai';
// import { BsThreeDots } from 'react-icons/bs';
// import { FaTrashAlt } from 'react-icons/fa';
import TableCell from '../TableCell';

// export default function Job({ onEdit, job }) {
//   const {
//     baseAsset, id, interval, isActive, name, quoteAsset,
//   } = job;
//   const borderColor = isActive ? '#5EDC1F' : '#FF2400';

//   return (
//     <Box
//       borderRadius="5px"
//       borderTop={`5px solid ${borderColor}`}
//       p="10px"
//       shadow="0 2px 5px 1px rgb(64 60 67 / 16%)"
//     >

//       <Stack align="center" isInline justify="space-between" mb="5px">
//         <Text fontSize="lg">{name}</Text>
//         <Menu isLazy>
//           <MenuButton
//             aria-label="options"
//             as={IconButton}
//             icon={<Icon as={BsThreeDots} />}
//             minW="auto"
//             variant="unstyled"
//           />
//           <MenuList>
//             <MenuItem
//               icon={<Icon as={AiFillEdit} />}
//               onClick={onEdit}
//             >
//               Edit Job
//             </MenuItem>
//             <MenuItem icon={<Icon as={FaTrashAlt} />}>Delete Job</MenuItem>
//           </MenuList>
//         </Menu>
//       </Stack>
//       <Stack isInline mb="20px" spacing={10}>
//         <Box>
//           <Text color="#778899" fontSize="sm">Base asset</Text>
//           <Text fontSize="md">{baseAsset}</Text>
//         </Box>
//         <Box>
//           <Text color="#778899" fontSize="sm">Quote asset</Text>
//           <Text fontSize="md">{quoteAsset}</Text>
//         </Box>
//         <Box>
//           <Text color="#778899" fontSize="sm">Interval</Text>
//           <Text fontSize="md">{interval}</Text>
//         </Box>
//       </Stack>
//       <Link
//         color="blue.600"
//         href={`/jobs/${id}`}
//         textDecor="underline"
//       >
//         View job details
//       </Link>
//     </Box>
//   );
// }

// Job.propTypes = {
//   onEdit: PropTypes.func.isRequired,
//   job: PropTypes.shape().isRequired,
// };

export default function Job({
  amount,
  disabled,
  lastRun,
  name,
  nextRun,
  schedule,
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
      <TableCell>{schedule}</TableCell>
      <TableCell>{timezone}</TableCell>
      <TableCell>{lastRun}</TableCell>
      <TableCell>{nextRun}</TableCell>
    </Tr>
  );
}

Job.propTypes = {
  amount: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  lastRun: PropTypes.oneOf(PropTypes.instanceOf(Date), PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  nextRun: PropTypes.oneOf(PropTypes.instanceOf(Date), PropTypes.string).isRequired,
  schedule: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
