import { apiClient } from './client';
import type {
  ApiResponse,
  NotificationDetails,
  NotificationSearchItem,
  SearchMode,
  VerifyRequest,
  VerifyResponseItem,
  SendEmailRequest,
  SendEmailRequestItem,
  SendEmailResponse,
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
  const encodedCode = encodeURIComponent(code);
  const response = await apiClient.get(`/km/nfind/${mode}/${encodedCode}`);
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
 * Verify notification
 * @param data - VerifyRequest data to verify
 * @returns VerifyResponseItem[]
 */
export const verifyNotification = async (data: VerifyRequest): Promise<ApiResponse<VerifyResponseItem>> => {
  const response = await apiClient.post('/km/verify', data);
  return response.data;
};

/**
 * Send email with inconsistency raport
 * @param data - SendEmailRequest data to send email
 * @returns SendEmailResponse
 */
export const sendEmail = async (data: SendEmailRequest): Promise<ApiResponse<SendEmailResponse>> => {
  const response = await apiClient.post('/km/incemail', data);
  return response.data;
};

/**
 * Finish verification process
 * @param data - SendEmailRequestItem[] data to finish verification - temporary typing
 * @returns SendEmailResponse - temporary typing
 */
export const finishVerification = async (data: SendEmailRequestItem[]): Promise<SendEmailResponse> => {
  const response = await apiClient.post('/km/verfin', data);
  return response.data;
};

