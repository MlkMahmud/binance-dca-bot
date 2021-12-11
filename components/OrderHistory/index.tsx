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
import OrderHistoryEmptyState from './EmptyState';
import OrderHistoryErrorState from './ErrorState';
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
  const [showErrorState, setShowErrorState] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setShowErrorState(false);
      const response = await fetch(`/api/jobs/${jobId}/orders`);
      if (response.ok) {
        const { data } = await response.json();
        setOrders(data);
      } else {
        throw new Error(response.statusText);
      }
    } catch {
      setShowErrorState(true);
    } finally {
      setIsLoading(false);
    }
  };

  const Component = () => {
    if (isLoading) {
      return <OrderHistoryLoadingState />;
    } else if (showErrorState) {
      return <OrderHistoryErrorState onRetry={fetchOrders} />;
    } else  if (orders.length < 1) {
      return <OrderHistoryEmptyState />
    }
    return (
      <>
        {orders.map((order) => (
          <Order key={order.orderId} {...order} />
        ))}
      </>
    );
  };

  useEffect(() => {
    fetchOrders();
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
        <DrawerBody p="0">{<Component />}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
