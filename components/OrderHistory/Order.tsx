import { RepeatIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Fill, Order as OrderType } from '../../types';

type Props = OrderType & {
  onClick: (orderId: number, symbol: string) => Promise<void>;
};

type RowProps = {
  children?: React.ReactNode;
  isCustom?: boolean;
  title: string;
  value?: any;
};

function Row({ children, isCustom = false, title, value }: RowProps) {
  return (
    <Flex align="center" justify="space-between">
      <Text color="rgb(112, 112, 138)" fontSize="14px" fontWeight="500">
        {title}
      </Text>
      {isCustom ? (
        children
      ) : (
        <Text color="rgb(30, 35, 41)" fontSize="14px" fontWeight="500">
          {value}
        </Text>
      )}
    </Flex>
  );
}

function Trade({
  commission,
  commissionAsset,
  price,
  qty,
}: Omit<Fill, 'tradeId'>) {
  return (
    <Stack borderBottom="1px dashed rgb(234, 236, 239)" pb="10px" spacing={1}>
      <Row title="commission" value={`${commission} ${commissionAsset}`} />
      <Row title="price" value={price} />
      <Row title="quantity" value={qty} />
    </Stack>
  );
}

export default function Order({
  cummulativeQuoteQty,
  executedQty,
  fills,
  onClick,
  orderId,
  origQty,
  status,
  symbol,
  transactTime,
}: Props) {
  const isPartiallyFilled = status === 'PARTIALLY_FILLED';
  return (
    <Accordion allowToggle border="transparent">
      <AccordionItem>
        <Stack borderBottom="1px solid rgb(234, 236, 239)" p="10px" spacing={1}>
          <Flex align="center" justify="space-between">
            <Text color="rgb(30, 35, 41)" fontSize="14px" fontWeight="600">
              {symbol}
            </Text>
            {isPartiallyFilled && (
              <IconButton
                aria-label="refresh order"
                height="auto"
                icon={<RepeatIcon />}
                minW="auto"
                onClick={() => onClick(orderId, symbol)}
                variant="unstyled"
              />
            )}
          </Flex>
          <Row
            title="Updated At:"
            value={new Date(transactTime).toLocaleString('en-GB')}
          />
          <Row title="Order Id:" value={orderId} />
          <Row isCustom title="Status:">
            <Badge colorScheme={isPartiallyFilled ? 'orange' : 'green'}>
              {status}
            </Badge>
          </Row>
          <Row title="Original Qty" value={origQty} />
          <Row title="Executed Qty" value={executedQty} />
          <Row title="Amount:" value={cummulativeQuoteQty} />
          <AccordionButton
            aria-label="show order fills"
            alignItems="end"
            bg="transparent"
            color="rgb(112, 122, 138)"
            display="flex"
            fontSize="14px"
            fontWeight="500"
            p="0"
            width="fit-content"
            _hover={{
              backgroundColor: 'transparent',
            }}
          >
            <Text mr="2.5px">More</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="0">
            <Text
              color="rgb(30, 35, 41)"
              fontSize="14px"
              fontWeight="500"
              textAlign="center"
              textDecor="underline"
              textTransform="capitalize"
            >
              trades
            </Text>
            <Stack spacing={2}>
              {fills.map((fill) => (
                <Trade
                  commission={fill.commission}
                  commissionAsset={fill.commissionAsset}
                  price={fill.price}
                  qty={fill.qty}
                  key={fill.tradeId}
                />
              ))}
            </Stack>
          </AccordionPanel>
        </Stack>
      </AccordionItem>
    </Accordion>
  );
}
