import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  notificationIds: number[];
  addNotification: (id: number) => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationIds, setNotificationIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('alumetal-notifications-ids');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alumetal-notifications-ids', JSON.stringify(notificationIds));
  }, [notificationIds]);

  const addNotification = (id: number) => {
    setNotificationIds((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeNotification = (id: number) => {
    setNotificationIds((prev) => prev.filter((notificationId) => notificationId !== id));
  };

  const clearAll = () => {
    setNotificationIds([]);
    localStorage.removeItem('alumetal-notifications-ids');
  };

  return (
    <NotificationContext.Provider value={{ notificationIds, addNotification, removeNotification, clearAll }}>
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

