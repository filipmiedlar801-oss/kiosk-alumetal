import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationUseCase } from '../services/notificationUseCase';

interface NotificationContextType {
  notificationIds: number[];
  addNotification: (id: number) => void;
  removeNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationIds, setNotificationIds] = useState<number[]>(() => {
    return NotificationUseCase.getNotificationIds();
  });

  useEffect(() => {
    NotificationUseCase.saveNotificationIds(notificationIds);
  }, [notificationIds]);

  const addNotification = (id: number) => {
    NotificationUseCase.addNotificationId(id);
    setNotificationIds(NotificationUseCase.getNotificationIds());
  };

  const removeNotification = (id: number) => {
    NotificationUseCase.removeNotification(id);
    setNotificationIds(NotificationUseCase.getNotificationIds());
  };

  const clearAllNotifications = () => {
    NotificationUseCase.clearAll();
    setNotificationIds([]);
  };

  return (
    <NotificationContext.Provider value={{ notificationIds, addNotification, removeNotification, clearAllNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

