import { useQuery, useMutation } from '@tanstack/react-query';
import {
  findNotification,
  getNotificationById,
  verifyNotification,
  getInconsistencies,
} from './endpoints';
import type { SearchMode } from './types';



/**
 * Hook to search for notifications via mutation (manual trigger)
 * Use this when search should be triggered by user action (button click)
 * @param mode - Search mode (PIN, ORDER, SHIPMENT, QR)
 * @returns Mutation result with notification details
 * 
 */
export const useFindNotification = () => {
  return useMutation({
    mutationFn: ({ mode, code }: { mode: SearchMode; code: string }) => 
      findNotification(mode, code),
  });
};


/**
 * Hook to get multiple notifications by array of IDs
 * @param ids - Array of notification IDs
 * @returns Query result with array of NotificationSearchItem
 */
export const useNotificationsById = (ids: number[]) => {
  return useQuery({
    queryKey: ['notifications', 'byIds', ids.sort().join(',')],
    queryFn: () => {
      if (ids.length === 0) {
        return { items: [], success: true, message: null, values: null };
      }
      const idsString = ids.join(',');
      return getNotificationById(idsString);
    },
  });
};

/**
 * Hook to verify notification data
 */
export const useVerifyNotification = () => {
  return useMutation({
    mutationFn: (data: any) => verifyNotification(data),
  });
};

/**
 * Hook to get inconsistencies
 */
export const useInconsistencies = (notificationId: number) => {
  return useQuery({
    queryKey: ['notification', 'inconsistencies', notificationId],
    queryFn: () => getInconsistencies(notificationId),
  });
};

