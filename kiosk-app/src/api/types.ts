export interface ApiResponse<T> {
  items: T[] | null;
  values: any | null;
  success: boolean;
  message: string | null;
}
export interface NotificationSearchItem {
  id: number;
  number: string;
  operationType: string;
  cargoDescription: string;
  weight: number;
}
export interface CargoItem {
  id: number;
  cargoName: string;
  weight: number;
  declaredWasteCode: string;
}
export interface NotificationDetails {
  id: number;
  driverName: string;
  personalIdNo: string;
  truckPlateNo: string;
  trailerPlateNo: string;
  isForeign: boolean;
  transportType: string;
  cargoItems: CargoItem[];
}


export interface VerifyRequest {
  notificationId: number;
  sentNo: string;
  bdoCode: string;
  driverDataConsistent: boolean;
  items: {
    cargoItemId: number;
    wasteCode: string;
  }[]
}
export interface VerifyResponseItem {
  description: string;
  sootData: string;
  paperData: string;
}

export interface InconsistencyData {
  notificationId: number;
  items: VerifyResponseItem[];
}

export interface SendEmailRequestItem {
  id: number;
  description: string;
  sootData: string;
  paperData: string;
}

export type SendEmailRequest = SendEmailRequestItem[];

export interface SendEmailResponse {
  values: { key: string; value: string }[] | null;
  success: boolean;
  message: string | null;
}

export const SearchMode = {
  PIN: 2,
  ORDER_ID: 1,
  QR_CODE: 3,
} as const;

export type SearchMode = typeof SearchMode[keyof typeof SearchMode];

