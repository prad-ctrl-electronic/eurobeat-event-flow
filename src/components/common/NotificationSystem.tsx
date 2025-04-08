
import React, { useEffect } from 'react';
import { useNotifications } from '@/contexts/EntityContext';
import { toast } from "sonner";

// Component to handle system-wide notifications
const NotificationSystem: React.FC = () => {
  const { notifications } = useNotifications();
  
  // Watch for new notifications and display them
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      
      switch (latestNotification.type) {
        case 'success':
          toast.success(latestNotification.message);
          break;
        case 'error':
          toast.error(latestNotification.message);
          break;
        case 'warning':
          toast.warning(latestNotification.message);
          break;
        case 'info':
        default:
          toast.info(latestNotification.message);
      }
    }
  }, [notifications]);
  
  // This component doesn't render anything visually
  return null;
};

export default NotificationSystem;
