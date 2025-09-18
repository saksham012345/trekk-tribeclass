import React, { ReactNode } from 'react';
import { useNotifications, Notification } from '../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  icon: ReactNode;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, icon }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    // Mark as read when clicked
    if (!notification.read) {
      await markAsRead([notification._id]);
    }

    // Navigate to relevant page if tripId exists
    if (notification.data?.tripId) {
      // You can implement navigation logic here
      window.location.href = `/trips/${notification.data.tripId}`;
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the main click handler
    await deleteNotification(notification._id);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTypeLabel = (type: Notification['type']): string => {
    switch (type) {
      case 'trip_join':
        return 'New Member';
      case 'trip_leave':
        return 'Member Left';
      case 'trip_delete':
        return 'Trip Cancelled';
      case 'trip_update':
        return 'Trip Updated';
      case 'trip_reminder':
        return 'Reminder';
      case 'system':
        return 'System';
      default:
        return 'Notification';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Type label and unread indicator */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {getTypeLabel(notification.type)}
                </span>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>

              {/* Title */}
              <h4 className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                {notification.title}
              </h4>

              {/* Message */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>

              {/* Additional info */}
              {notification.data?.actorName && (
                <p className="text-xs text-gray-500 mt-1">
                  by {notification.data.actorName}
                </p>
              )}

              {/* Timestamp */}
              <p className="text-xs text-gray-400 mt-1">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 ml-2">
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                aria-label="Delete notification"
                title="Delete notification"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
