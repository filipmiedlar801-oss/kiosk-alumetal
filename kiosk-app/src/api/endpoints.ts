import { apiClient } from './client';
import type {
  ApiResponse,
  NotificationDetails,
  NotificationSearchItem,
  Inconsistency,
  SearchMode,
} from './types';

/**
 * Find notification details by PIN, Order ID, or QR code
 * @param mode - 1: PIN, 2: Order ID, 3: QR code
 * @param code - Search value
 * @returns NotificationDetails (not a list!)
 */
export const findNotification = async (
  mode: SearchMode,
  code: string
): Promise<ApiResponse<NotificationDetails>> => {
  const response = await apiClient.get(`/km/nfind/${mode}/${code}`);
  return response.data;
};

/**
 * Get notification basic info by ID(s)
 * @param id - Notification ID (number) or comma-separated IDs
 * @returns NotificationSearchItem[] - List of basic notification info
 */
export const getNotificationById = async (
  id: number | string
): Promise<ApiResponse<NotificationSearchItem>> => {
  const response = await apiClient.get(`/km/notifs/${id}`);
  return response.data;
};

/**
 * Verify notification data TODO
 */
export const verifyNotification = async (data: any): Promise<ApiResponse<null>> => {
  const response = await apiClient.post('/km/verify', data);
  return response.data;
};

/**
 * Get list of inconsistencies for a notification
 * @param notificationId - Notification ID
 */
export const getInconsistencies = async (
  notificationId: number
): Promise<ApiResponse<Inconsistency>> => {
  const response = await apiClient.get(`/km/inconsistencies/${notificationId}`);
  return response.data;
};

