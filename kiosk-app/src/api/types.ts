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

export interface Inconsistency {

}

export const SearchMode = {
  PIN: 1,
  ORDER_ID: 2,
  QR_CODE: 3,
} as const;

export type SearchMode = typeof SearchMode[keyof typeof SearchMode];

