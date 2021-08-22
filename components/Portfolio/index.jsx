import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { HiEye, HiEyeOff, HiRefresh } from 'react-icons/hi';

export default function Portfolio() {
  const [balances] = useState([]);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const currentAsset = balances.find(({ asset }) => asset === selectedAsset);

  return (
    <Box
      bgColor="#FFF"
      maxW="650px"
      shadow="rgb(0 0 0 / 16%) 0px 1px 2px -2px, rgb(0 0 0 / 12%) 0px 3px 6px 0px, rgb(0 0 0 / 9%) 0px 5px 12px 4px"
    >
      <Flex
        align="center"
        borderBottom="1px solid #f0f0f0"
        justify="space-between"
        p={2.5}
      >
        <Text
          as="h3"
          fontSize="2xl"
          fontWeight="semibold"
        >
          Portfolio
        </Text>
        <Box>
          <IconButton
            aria-label={`${isBalanceHidden ? 'show' : 'hide'} balance`}
            h={['35px', '40px']}
            icon={<Icon as={isBalanceHidden ? HiEyeOff : HiEye} boxSize={['25px', '30px']} />}
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            minW={['35px', '40px']}
            variant="unstyled"
          />
          <IconButton
            aria-label="refresh portfolio"
            h={['35px', '40px']}
            icon={<Icon as={HiRefresh} boxSize={['25px', '30px']} />}
            minW={['35px', '40px']}
            variant="unstyled"
          />
        </Box>
      </Flex>
      <Box
        p="15px 10px"
      >
        <Grid
          alignItems="center"
          columnGap="2%"
          templateColumns="auto 1fr"
          mb="20px"
        >
          <Text fontWeight="bold">Asset:</Text>
          <Select
            onChange={(e) => setSelectedAsset(e.target.value)}
            value={selectedAsset}
          >
            {balances.map(({ asset }) => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </Select>
        </Grid>
        <Flex align="center" justify="space-between" mb="5px">
          <Text fontWeight="semibold">Free:</Text>
          <Text fontWeight="medium">{isBalanceHidden ? '***' : `${currentAsset?.free} ${selectedAsset}`}</Text>
        </Flex>
        <Flex align="center" justify="space-between" mb="5px">
          <Text fontWeight="semibold">Locked:</Text>
          <Text fontWeight="medium">{isBalanceHidden ? '***' : `${currentAsset?.locked} ${selectedAsset}`}</Text>
        </Flex>
      </Box>
      <Flex
        align="center"
        borderTop="1px solid #f0f0f0"
        justify="space-between"
        p={2.5}
      >
        <Text fontWeight="semibold">Total:</Text>
        <Text fontWeight="medium">{isBalanceHidden ? '***' : `${currentAsset?.total} ${selectedAsset}`}</Text>
      </Flex>
    </Box>
  );
}
