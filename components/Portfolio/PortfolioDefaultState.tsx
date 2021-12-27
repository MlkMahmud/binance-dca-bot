import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Select,
  Text,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff, HiRefresh } from 'react-icons/hi';

type Props = {
  assets: Array<{
    asset: string;
    free: string;
    locked: string;
    total: number;
  }>;
  onChange: (value: string) => void;
  onRefresh: () => Promise<void>;
  selectedSymbol: string;
};

export default function PortfolioDefaultState({
  assets,
  onChange,
  onRefresh,
  selectedSymbol,
}: Props) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const { free, locked, total } =
    assets.find(({ asset }) => asset === selectedSymbol) || {};
  return (
    <Box
      bgColor="#FFF"
      border="1px solid #DADCE0"
      borderRadius="5px"
      maxW="650px"
    >
      <Flex
        align="center"
        borderBottom="1px solid #f0f0f0"
        justify="space-between"
        p={2.5}
      >
        <Text as="h3" fontSize="2xl" fontWeight="semibold">
          Portfolio
        </Text>
        <Box>
          <IconButton
            aria-label={`${isBalanceHidden ? 'show' : 'hide'} balance`}
            h={['35px', '40px']}
            icon={
              <Icon
                as={isBalanceHidden ? HiEyeOff : HiEye}
                boxSize={['25px', '30px']}
              />
            }
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            minW={['35px', '40px']}
            variant="unstyled"
          />
          <IconButton
            aria-label="refresh portfolio"
            h={['35px', '40px']}
            icon={<Icon as={HiRefresh} boxSize={['25px', '30px']} />}
            minW={['35px', '40px']}
            onClick={onRefresh}
            variant="unstyled"
          />
        </Box>
      </Flex>
      <Box p="15px 10px">
        <Grid
          alignItems="center"
          columnGap="2%"
          templateColumns="auto 1fr"
          mb="20px"
        >
          <Text fontWeight="bold">Asset:</Text>
          <Select
            aria-label="assets"
            onChange={(e) => onChange(e.target.value)}
            value={selectedSymbol}
          >
            {assets.map(({ asset: symbol }) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </Select>
        </Grid>
        <Flex align="center" justify="space-between" mb="5px">
          <Text fontWeight="semibold">Free:</Text>
          <Text fontWeight="medium">
            {isBalanceHidden
              ? '***'
              : `${Number(free).toFixed(2)} ${selectedSymbol}`}
          </Text>
        </Flex>
        <Flex align="center" justify="space-between" mb="5px">
          <Text fontWeight="semibold">Locked:</Text>
          <Text fontWeight="medium">
            {isBalanceHidden
              ? '***'
              : `${Number(locked).toFixed(2)} ${selectedSymbol}`}
          </Text>
        </Flex>
      </Box>
      <Flex
        align="center"
        borderTop="1px solid #f0f0f0"
        justify="space-between"
        p={2.5}
      >
        <Text fontWeight="semibold">Total:</Text>
        <Text fontWeight="medium">
          {isBalanceHidden ? '***' : `${total?.toFixed(2)} ${selectedSymbol}`}
        </Text>
      </Flex>
    </Box>
  );
}
