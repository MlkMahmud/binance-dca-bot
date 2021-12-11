import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Order from './Order';
import OrderHistoryLoadingState from './LoadingState';

type Props = {
  isOpen: boolean;
  jobId: string;
  jobName: string;
  onClose: () => void;
};

export default function OrderHistory({
  isOpen,
  jobId,
  jobName,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setOrders([
        {
          orderId: 3119984,
          origQty: '0.05000000',
          status: 'FILLED',
          symbol: 'BNBUSDT',
          transactTime: '13/07/2021, 16:41:53',
          cummulativeQuoteQty: '37.00000000',
          executedQty: '0.05000000',
        },
        {
          orderId: 3119985,
          origQty: '0.05000000',
          status: 'FILLED',
          symbol: 'BNBUSDT',
          transactTime: '13/07/2021, 16:41:53',
          cummulativeQuoteQty: '37.00000000',
          executedQty: '0.05000000',
        },
        {
          orderId: 3119976,
          origQty: '0.05000000',
          status: 'FILLED',
          symbol: 'BNBUSDT',
          transactTime: '13/07/2021, 16:41:53',
          cummulativeQuoteQty: '37.00000000',
          executedQty: '0.05000000',
        },
        {
          orderId: 3119987,
          origQty: '0.05000000',
          status: 'FILLED',
          symbol: 'BNBUSDT',
          transactTime: '13/07/2021, 16:41:53',
          cummulativeQuoteQty: '37.00000000',
          executedQty: '0.05000000',
        },
      ]);
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      isFullHeight
      onClose={onClose}
      placement="left"
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <Box borderBottom="1px solid #E2E8F0">
          <DrawerHeader p="1rem 10px">
            <Text color="gray.900" fontSize="lg" fontWeight="bold">
              Order history
            </Text>
            <Text color="gray.600" fontSize="sm">
              {jobName}
            </Text>
          </DrawerHeader>
        </Box>
        <DrawerBody p="0">
          {isLoading ? (
            <OrderHistoryLoadingState />
          ) : (
            <>
              {orders.map((order) => (
                <Order key={order.orderId} {...order} />
              ))}
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
