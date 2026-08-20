import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Bell, 
  User, 
  ShoppingBag, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Settings as SettingsIcon
} from 'lucide-react';
import type { BakeryNotification } from '../types/notification';
import { 
  loadStoredNotifications, 
  saveStoredNotifications 
} from '../types/notification';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<BakeryNotification[]>(() => loadStoredNotifications());
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sync with localStorage
  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  const handleMarkAsRead = (id: string, link?: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    if (link) {
      setIsOpen(false);
      navigate(link);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Hapus semua riwayat notifikasi?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type: BakeryNotification['type']) => {
    switch (type) {
      case 'order':
        return <div className="notif-icon-circle order-type"><ShoppingBag size={16} /></div>;
      case 'stock':
        return <div className="notif-icon-circle stock-type"><AlertTriangle size={16} /></div>;
      case 'expiry':
        return <div className="notif-icon-circle expiry-type"><Clock size={16} /></div>;
      case 'payment':
        return <div className="notif-icon-circle payment-type"><CheckCircle size={16} /></div>;
      default:
        return <div className="notif-icon-circle system-type"><Bell size={16} /></div>;
    }
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search orders, products, or customers..." />
      </div>

      <div className="header-actions">
        {/* Notification Bell with Dropdown Container */}
        <div className="notification-container" ref={dropdownRef}>
          <button 
            type="button"
            className={`icon-button notification-btn ${isOpen ? 'active' : ''}`}
            onClick={handleToggleOpen}
            aria-label="Open notifications"
            aria-expanded={isOpen}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          {/* Dropdown Menu Panel */}
          {isOpen && (
            <div className="notification-dropdown">
              <div className="notif-dropdown-header">
                <div className="notif-title-row">
                  <h3>Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="notif-unread-badge">{unreadCount} baru</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    type="button" 
                    className="mark-all-read-btn flex-center"
                    onClick={handleMarkAllAsRead}
                    title="Tandai semua telah dibaca"
                  >
                    <CheckCheck size={14} style={{ marginRight: '4px' }} />
                    Tandai dibaca
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="notif-filter-tabs">
                <button 
                  type="button" 
                  className={`notif-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  Semua ({notifications.length})
                </button>
                <button 
                  type="button" 
                  className={`notif-filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('unread')}
                >
                  Belum Dibaca ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="notif-list">
                {filteredNotifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <Bell size={36} className="notif-empty-icon" />
                    <p className="notif-empty-title">Tidak ada notifikasi</p>
                    <p className="text-muted text-sm">
                      {activeFilter === 'unread' 
                        ? 'Semua notifikasi sudah Anda baca.' 
                        : 'Belum ada notifikasi baru saat ini.'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                      onClick={() => handleMarkAsRead(notif.id, notif.link)}
                    >
                      {getNotifIcon(notif.type)}
                      <div className="notif-item-content">
                        <div className="notif-item-header">
                          <span className="notif-item-title">{notif.title}</span>
                          {!notif.read && <span className="notif-unread-dot" />}
                        </div>
                        <p className="notif-item-message">{notif.message}</p>
                        <div className="notif-item-footer">
                          <span className="notif-item-time">{notif.time}</span>
                          {notif.link && (
                            <span className="notif-item-link-hint flex-center">
                              Buka <ExternalLink size={11} style={{ marginLeft: '2px' }} />
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="notif-item-delete-btn"
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        title="Hapus notifikasi ini"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="notif-dropdown-footer">
                {notifications.length > 0 && (
                  <button 
                    type="button" 
                    className="notif-footer-link clear-btn"
                    onClick={handleClearAll}
                  >
                    Hapus Semua
                  </button>
                )}
                <button 
                  type="button" 
                  className="notif-footer-link settings-btn flex-center"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/settings');
                  }}
                >
                  <SettingsIcon size={14} style={{ marginRight: '4px' }} />
                  Pengaturan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile in Header */}
        <div className="user-profile" onClick={() => navigate('/admin/settings')}>
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Chef Mario</span>
            <span className="user-role">Head Baker</span>
          </div>
        </div>
      </div>
    </header>
  );
};
