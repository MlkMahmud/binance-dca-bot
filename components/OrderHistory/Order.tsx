import { RepeatIcon } from '@chakra-ui/icons';
import { Badge, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  cummulativeQuoteQty: string;
  executedQty: string;
  fills: any[];
  orderId: number;
  origQty: string;
  status: 'FILLED' | 'PARTIALLY_FILLED';
  symbol: string;
  transactTime: string;
};

type RowProps = {
  children?: React.ReactNode;
  isCustom?: boolean;
  title: string;
  value?: any; 
}

function Row({
  children, isCustom = false, title, value,
}: RowProps) {
  return (
    <Flex align="center" justify="space-between">
        <Text color="rgb(112, 112, 138)" fontSize="14px" fontWeight="500">
          {title}
        </Text>
        {isCustom ? children : (
          <Text color="rgb(30, 35, 41)" fontSize="14px" fontWeight="500">
          {value}
        </Text>
        )}
        
      </Flex>
  );
}

export default function Order({
  cummulativeQuoteQty,
  executedQty,
  fills,
  orderId,
  origQty,
  status,
  symbol,
  transactTime,
}: Props) {
  const isFilled = status === 'FILLED';
  return (
    <Stack borderBottom="1px solid rgb(234, 236, 239)" p="10px" spacing={1}>
      <Flex align="center" justify="space-between">
        <Text color="rgb(30, 35, 41)" fontSize="14px" fontWeight="600">
          {symbol}
        </Text>
        {!isFilled && (
          <IconButton
            aria-label="refresh order"
            height="auto"
            icon={<RepeatIcon />}
            minW="auto"
            variant="unstyled"
          />
        )}
      </Flex>
      <Row title="Order Id:" value={orderId} />
      <Row isCustom title="Status:">
        <Badge colorScheme={isFilled ? 'green' : 'orange'}>{status}</Badge>
      </Row>
      <Row title="Updated At:"  value={transactTime} />
      <Row title="Original Qty" value={origQty} />
      <Row title="Executed Qty" value={executedQty} />
      <Row title="Amount:" value={cummulativeQuoteQty} />
    </Stack>
  );
}
