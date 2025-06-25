import React, { useState } from 'react';
import { Bell, AlertTriangle, Truck, HardHat, X } from 'lucide-react';

export default function Site_Manager_Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Low Stock Alert',
      message: 'Concrete mix running low - only 2 bags remaining in storage area B',
      time: '5 minutes ago',
      badge: { text: 'Urgent', color: 'bg-yellow-400 text-gray-900' },
      isRead: false
    },
    {
      id: 2,
      type: 'delay',
      icon: Truck,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Supplier Delay',
      message: 'Steel delivery postponed by 2 hours due to traffic conditions',
      time: '12 minutes ago',
      badge: { text: 'Urgent', color: 'bg-yellow-400 text-gray-900' },
      isRead: false
    },
    {
      id: 3,
      type: 'request',
      icon: HardHat,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      title: 'New Material Request',
      message: 'Team Alpha requested additional safety helmets for new workers',
      time: '1 hour ago',
      badge: { text: 'Info', color: 'bg-teal-600 text-white' },
      isRead: false
    }
  ]);

  const [isOpen, setIsOpen] = useState(true);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`${notification.iconBg} p-2 rounded-lg flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </h3>
                          <span className={`${notification.badge.color} px-2 py-1 rounded-full text-xs font-medium flex-shrink-0`}>
                            {notification.badge.text}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {notification.time}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button 
            className="w-full text-center text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"
            style={{ color: '#236571' }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}