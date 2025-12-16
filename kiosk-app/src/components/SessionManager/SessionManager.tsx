import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationUseCase } from '../../services/notificationUseCase';

const SESSION_TIMEOUT = 5 * 60 * 1000; 

export const SessionManager = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearSession = () => {
      NotificationUseCase.clearAll();
      localStorage.clear();
      navigate('/language', { replace: true });
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(clearSession, SESSION_TIMEOUT);
    };

    const handleActivity = () => {
      resetTimer();
    };

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);

  return null; 
};

export default SessionManager;

