import type { NotificationDetails, InconsistencyData, VerifyResponseItem } from '../api/types';

const STORAGE_KEYS = {
  NOTIFICATION_DETAILS: 'alumetal-notification-details',
  INCONSISTENCIES: 'alumetal-inconsistencies',
  DRIVER_DATA: 'alumetal-driver-data',
  NOTIFICATION_IDS: 'alumetal-notifications-ids',
} as const;

/**
 * Notification Use Case
 */
export class NotificationUseCase {
  // ========== Notification Details Management ==========
  
  /**
   * Zapisuje szczegóły notyfikacji do localStorage
   */
  static saveNotificationDetails(notification: NotificationDetails): void {
    const savedDetails = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_DETAILS);
    let detailsMap: Record<string, NotificationDetails> = {};
    
    if (savedDetails) {
      try {
        detailsMap = JSON.parse(savedDetails);
      } catch (e) {
        console.error('Error parsing notification details:', e);
      }
    }
    
    detailsMap[notification.id.toString()] = notification;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_DETAILS, JSON.stringify(detailsMap));
  }

  /**
   * Pobiera szczegóły notyfikacji z localStorage
   */
  static getNotificationDetails(id: number): NotificationDetails | null {
    const savedDetails = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_DETAILS);
    if (!savedDetails) return null;
    
    try {
      const detailsMap = JSON.parse(savedDetails);
      return detailsMap[id.toString()] || null;
    } catch (e) {
      console.error('Error parsing notification details:', e);
      return null;
    }
  }

  /**
   * Usuwa szczegóły notyfikacji z localStorage
   */
  static removeNotificationDetails(id: number): void {
    const savedDetails = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_DETAILS);
    if (!savedDetails) return;
    
    try {
      const detailsMap = JSON.parse(savedDetails);
      delete detailsMap[id.toString()];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_DETAILS, JSON.stringify(detailsMap));
    } catch (e) {
      console.error('Error removing notification details:', e);
    }
  }

  /**
   * Pobiera wszystkie zapisane szczegóły notyfikacji
   */
  static getAllNotificationDetails(): Record<string, NotificationDetails> {
    const savedDetails = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_DETAILS);
    if (!savedDetails) return {};
    
    try {
      return JSON.parse(savedDetails);
    } catch (e) {
      console.error('Error parsing notification details:', e);
      return {};
    }
  }

  // ========== Inconsistencies Management ==========

  /**
   * Pobiera wszystkie inconsistencies z localStorage
   */
  static getInconsistencies(): InconsistencyData[] {
    const savedInconsistencies = localStorage.getItem(STORAGE_KEYS.INCONSISTENCIES);
    if (!savedInconsistencies) return [];
    
    try {
      const parsed = JSON.parse(savedInconsistencies);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing inconsistencies:', e);
      return [];
    }
  }

  /**
   * Zapisuje inconsistencies do localStorage
   */
  static saveInconsistencies(inconsistencies: InconsistencyData[]): void {
    localStorage.setItem(STORAGE_KEYS.INCONSISTENCIES, JSON.stringify(inconsistencies));
  }

  /**
   * Aktualizuje inconsistencies dla konkretnej notyfikacji
   */
  static updateInconsistenciesForNotification(
    notificationId: number,
    inconsistencies: VerifyResponseItem[]
  ): void {
    const inconsistenciesArray = this.getInconsistencies();
    
    if (inconsistencies.length > 0) {
      // Ma inconsistencies - aktualizuj lub dodaj
      const existingIndex = inconsistenciesArray.findIndex(
        item => item.notificationId === notificationId
      );
      
      const newInconsistencyData: InconsistencyData = {
        notificationId,
        items: inconsistencies
      };
      
      if (existingIndex >= 0) {
        inconsistenciesArray[existingIndex] = newInconsistencyData;
      } else {
        inconsistenciesArray.push(newInconsistencyData);
      }
    } else {
      // Brak inconsistencies - usuń jeśli istnieje (użytkownik poprawił dane)
      const filtered = inconsistenciesArray.filter(
        item => item.notificationId !== notificationId
      );
      inconsistenciesArray.length = 0;
      inconsistenciesArray.push(...filtered);
    }
    
    this.saveInconsistencies(inconsistenciesArray);
  }

  /**
   * Usuwa inconsistencies dla konkretnej notyfikacji
   */
  static removeInconsistenciesForNotification(notificationId: number): void {
    const inconsistenciesArray = this.getInconsistencies();
    const filtered = inconsistenciesArray.filter(
      item => item.notificationId !== notificationId
    );
    this.saveInconsistencies(filtered);
  }

  /**
   * Sprawdza czy istnieją inconsistencies
   */
  static hasInconsistencies(): boolean {
    const inconsistencies = this.getInconsistencies();
    return inconsistencies.some(item => item.items && item.items.length > 0);
  }

  /**
   * Pobiera inconsistencies dla konkretnej notyfikacji
   */
  static getInconsistenciesForNotification(notificationId: number): InconsistencyData | null {
    const inconsistencies = this.getInconsistencies();
    return inconsistencies.find(item => item.notificationId === notificationId) || null;
  }

  /**
   * Czyści wszystkie inconsistencies
   */
  static clearAllInconsistencies(): void {
    localStorage.removeItem(STORAGE_KEYS.INCONSISTENCIES);
  }

  // ========== Notification IDs Management ==========

  /**
   * Pobiera listę ID notyfikacji
   */
  static getNotificationIds(): number[] {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_IDS);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Zapisuje listę ID notyfikacji
   */
  static saveNotificationIds(ids: number[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_IDS, JSON.stringify(ids));
  }

  /**
   * Dodaje ID notyfikacji
   */
  static addNotificationId(id: number): void {
    const ids = this.getNotificationIds();
    if (!ids.includes(id)) {
      ids.push(id);
      this.saveNotificationIds(ids);
    }
  }

  /**
   * Usuwa ID notyfikacji
   */
  static removeNotificationId(id: number): void {
    const ids = this.getNotificationIds();
    const filtered = ids.filter(notificationId => notificationId !== id);
    this.saveNotificationIds(filtered);
  }

  /**
   * Czyści wszystkie ID notyfikacji
   */
  static clearAllNotificationIds(): void {
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_IDS);
  }

  // ========== Driver Data Management ==========

  /**
   * Zapisuje dane kierowcy
   */
  static saveDriverData(driverData: {
    driverName: string;
    personalIdNo: string;
    truckPlateNo: string;
    trailerPlateNo?: string;
  }): void {
    localStorage.setItem(STORAGE_KEYS.DRIVER_DATA, JSON.stringify(driverData));
  }

  /**
   * Pobiera dane kierowcy
   */
  static getDriverData(): {
    driverName: string;
    personalIdNo: string;
    truckPlateNo: string;
    trailerPlateNo?: string;
  } | null {
    const saved = localStorage.getItem(STORAGE_KEYS.DRIVER_DATA);
    if (!saved) return null;
    
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing driver data:', e);
      return null;
    }
  }

  /**
   * Usuwa dane kierowcy
   */
  static clearDriverData(): void {
    localStorage.removeItem(STORAGE_KEYS.DRIVER_DATA);
  }

  // ========== Combined Operations ==========

  /**
   * Usuwa wszystkie dane związane z notyfikacją
   */
  static removeNotification(id: number): void {
    this.removeNotificationId(id);
    this.removeNotificationDetails(id);
    this.removeInconsistenciesForNotification(id);
  }

  /**
   * Czyści wszystkie dane związane z notyfikacjami
   */
  static clearAll(): void {
    this.clearAllNotificationIds();
    this.clearAllInconsistencies();
    this.clearDriverData();
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_DETAILS);
  }

  /**
   * Przetwarza odpowiedź weryfikacji i aktualizuje inconsistencies
   */
  static processVerificationResponse(
    notificationId: number,
    response: { items?: VerifyResponseItem[] | null }
  ): void {
    const inconsistencies = response.items || [];
    this.updateInconsistenciesForNotification(notificationId, inconsistencies);
  }
}

