import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export interface Notification {
  _id: string;
  type: 'trip_join' | 'trip_leave' | 'trip_update' | 'trip_delete' | 'trip_reminder' | 'system';
  title: string;
  message: string;
  data?: {
    tripId?: string;
    actorId?: string;
    actorName?: string;
    tripTitle?: string;
    [key: string]: any;
  };
  read: boolean;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  isConnected: boolean;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    if (!token) return;

    // Initialize Socket.IO connection
    const socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:4000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('🔗 Connected to notification server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    // Listen for new notifications
    socketInstance.on('new_notification', (notification: Notification) => {
      console.log('📨 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev]);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new window.Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification._id
        });
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    // Request notification permission when component mounts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initial fetch of notifications and unread count
    fetchNotifications();
    refreshUnreadCount();
  }, []);

  const fetchNotifications = async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const refreshUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications/mark-read`,
        { notificationIds },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification._id)
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      const unreadNotifications = notificationIds.filter(id => {
        const notification = notifications.find(n => n._id === id);
        return notification && !notification.read;
      });
      setUnreadCount(prev => Math.max(0, prev - unreadNotifications.length));

      // Notify server via socket for real-time updates
      if (socket && notificationIds.length === 1) {
        socket.emit('notification_read', notificationIds[0]);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));

      // Update unread count if the deleted notification was unread
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    socket,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
