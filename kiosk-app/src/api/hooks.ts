import { useQuery, useMutation } from '@tanstack/react-query';
import {
  findNotification,
  getNotificationById,
  sendEmail,
  verifyNotification,
  finishVerification,
} from './endpoints';
import type { SearchMode, SendEmailRequest, SendEmailRequestItem } from './types';



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
 * Hook to send email with inconsistency raport
 * @param data - SendEmailRequest data to send email
 * @returns Mutation result with SendEmailResponse
 */
export const useSendInconsistencyEmail = () => {
  return useMutation({
    mutationFn: (data: SendEmailRequest) => sendEmail(data),
  });
};

/**
 * Hook to finish verification process
 * lacks proper implementation/typing atm
 */
export const useFinishVerification = () => {
  return useMutation({
    mutationFn: (data: SendEmailRequestItem[]) => finishVerification(data),
  });
};

