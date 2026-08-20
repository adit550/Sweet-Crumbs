import React, { useState } from 'react';
import { 
  Store, 
  User, 
  CreditCard, 
  Package, 
  Bell, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Camera
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsRow } from '../components/settings/SettingsRow';
import { SettingsToggle } from '../components/settings/SettingsToggle';
import type { AppSettings, SettingsTabId } from '../types/settings';
import { loadStoredSettings, saveStoredSettings, defaultSettings } from '../services/settingsStorage';
import './Settings.css';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => loadStoredSettings());
  const [activeTab, setActiveTab] = useState<SettingsTabId | 'all'>('all');
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });
  
  // Password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile edit modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(settings.profile);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setSaveToast({ show: true, message, type });
    setTimeout(() => {
      setSaveToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = saveStoredSettings(settings);
    if (success) {
      showToast('Changes saved successfully! Preferences have been updated.');
    } else {
      showToast('Unable to save settings to local storage.', 'info');
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(defaultSettings);
      saveStoredSettings(defaultSettings);
      showToast('All settings have been reset to system defaults.', 'info');
    }
  };

  // Password submission handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess(false);
      showToast('Password changed successfully.');
    }, 1200);
  };

  // Profile modal submission handler
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({ ...settings, profile: tempProfile });
    setProfileModalOpen(false);
    showToast('Profile information updated.');
  };

  const tabs: { id: SettingsTabId | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Settings', icon: <Sparkles size={18} /> },
    { id: 'bakery', label: 'Bakery Info', icon: <Store size={18} /> },
    { id: 'profile', label: 'Profile & Account', icon: <User size={18} /> },
    { id: 'orders', label: 'Orders & Payments', icon: <CreditCard size={18} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="settings-page">
      {/* Toast Notification */}
      {saveToast.show && (
        <div className={`settings-toast-banner ${saveToast.type}`}>
          <CheckCircle2 size={20} />
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="page-header flex-between settings-header-row">
        <div>
          <h1>Settings</h1>
          <p className="text-muted">Manage your bakery system preferences and account settings.</p>
        </div>
        <div className="settings-header-actions">
          <button 
            type="button" 
            className="secondary-btn flex-center" 
            style={{ gap: '8px' }} 
            onClick={handleResetToDefaults}
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>
          <button 
            type="button" 
            className="primary-btn flex-center" 
            style={{ gap: '8px' }} 
            onClick={() => handleSaveAll()}
            title="Save all changes"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="settings-nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Grid Content */}
      <div className="settings-content-grid">
        {/* ================= A. BAKERY INFORMATION ================= */}
        {(activeTab === 'all' || activeTab === 'bakery') && (
          <SettingsSection
            id="bakery-info"
            icon={<Store size={22} />}
            title="Bakery Information"
            description="Configure basic store profile, operational hours, and regional standards."
            badge="General"
            footerActions={
              <button type="button" className="primary-btn small-btn" onClick={() => handleSaveAll()}>
                Save Bakery Info
              </button>
            }
          >
            <SettingsRow label="Bakery Name" description="The official trade name displayed across receipts and portals." htmlFor="bakeryName" required>
              <input
                id="bakeryName"
                type="text"
                value={settings.bakery.bakeryName}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, bakeryName: e.target.value }
                })}
                placeholder="e.g. BakerySys"
              />
            </SettingsRow>

            <SettingsRow label="Tagline / Slogan" description="Brief subtitle for store branding." htmlFor="tagline">
              <input
                id="tagline"
                type="text"
                value={settings.bakery.tagline}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, tagline: e.target.value }
                })}
                placeholder="e.g. Artisan Bakery & Fresh Pastries"
              />
            </SettingsRow>

            <SettingsRow label="Address" description="Physical bakery address printed on client receipts." htmlFor="address" alignTop required>
              <textarea
                id="address"
                rows={3}
                value={settings.bakery.address}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, address: e.target.value }
                })}
                placeholder="Enter complete store address..."
              />
            </SettingsRow>

            <SettingsRow label="Phone Number" description="Contact phone for customer queries & delivery." htmlFor="bakeryPhone" required>
              <input
                id="bakeryPhone"
                type="tel"
                value={settings.bakery.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, phone: e.target.value }
                })}
                placeholder="e.g. +62 812-3456-7890"
              />
            </SettingsRow>

            <SettingsRow label="Official Email" description="Used for system notifications and customer invoices." htmlFor="bakeryEmail" required>
              <input
                id="bakeryEmail"
                type="email"
                value={settings.bakery.email}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, email: e.target.value }
                })}
                placeholder="contact@bakerysys.com"
              />
            </SettingsRow>

            <SettingsRow label="Business Hours" description="Daily operating hours when bakery is open for orders.">
              <div className="time-range-picker">
                <div className="time-input-wrap">
                  <span className="text-muted text-sm">Open</span>
                  <input
                    type="time"
                    aria-label="Opening time"
                    value={settings.bakery.businessHoursOpen}
                    onChange={(e) => setSettings({
                      ...settings,
                      bakery: { ...settings.bakery, businessHoursOpen: e.target.value }
                    })}
                  />
                </div>
                <span className="time-separator">-</span>
                <div className="time-input-wrap">
                  <span className="text-muted text-sm">Close</span>
                  <input
                    type="time"
                    aria-label="Closing time"
                    value={settings.bakery.businessHoursClose}
                    onChange={(e) => setSettings({
                      ...settings,
                      bakery: { ...settings.bakery, businessHoursClose: e.target.value }
                    })}
                  />
                </div>
              </div>
            </SettingsRow>

            <SettingsRow label="Primary Currency" description="Default currency used across all pricing & transactions.">
              <select
                aria-label="Primary Currency"
                value={settings.bakery.currency}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, currency: e.target.value }
                })}
              >
                <option value="IDR (Rp)">IDR (Rp) - Indonesian Rupiah</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="SGD (S$)">SGD (S$) - Singapore Dollar</option>
                <option value="MYR (RM)">MYR (RM) - Malaysian Ringgit</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
              </select>
            </SettingsRow>

            <SettingsRow label="System Timezone" description="Affects order timestamps and daily report schedules.">
              <select
                aria-label="System Timezone"
                value={settings.bakery.timezone}
                onChange={(e) => setSettings({
                  ...settings,
                  bakery: { ...settings.bakery, timezone: e.target.value }
                })}
              >
                <option value="Asia/Jakarta (WIB - UTC+7)">Asia/Jakarta (WIB - UTC+7)</option>
                <option value="Asia/Makassar (WITA - UTC+8)">Asia/Makassar (WITA - UTC+8)</option>
                <option value="Asia/Jayapura (WIT - UTC+9)">Asia/Jayapura (WIT - UTC+9)</option>
                <option value="Asia/Singapore (UTC+8)">Asia/Singapore (UTC+8)</option>
              </select>
            </SettingsRow>
          </SettingsSection>
        )}

        {/* ================= B. PROFILE & ACCOUNT ================= */}
        {(activeTab === 'all' || activeTab === 'profile') && (
          <SettingsSection
            id="profile-account"
            icon={<User size={22} />}
            title="Profile & Account"
            description="Manage your staff personal information, active role, and authentication credentials."
            badge="Account"
          >
            <div className="profile-card-overview">
              <div className="profile-avatar-large">
                <div className="avatar-circle">
                  {settings.profile.fullName.charAt(0) || 'M'}
                </div>
                <button 
                  type="button" 
                  className="avatar-edit-overlay"
                  onClick={() => showToast('Avatar upload simulation triggered.', 'info')}
                  title="Change avatar photo"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div className="profile-details-text">
                <h4>{settings.profile.fullName}</h4>
                <p className="text-muted text-sm">{settings.profile.email}</p>
                <div className="profile-role-chip">
                  <span className="role-dot" />
                  {settings.profile.role}
                </div>
              </div>
              <div className="profile-header-actions">
                <button 
                  type="button" 
                  className="secondary-btn small-btn"
                  onClick={() => {
                    setTempProfile(settings.profile);
                    setProfileModalOpen(true);
                  }}
                >
                  Edit Profile
                </button>
                <button 
                  type="button" 
                  className="secondary-btn small-btn flex-center"
                  style={{ gap: '6px' }}
                  onClick={() => setPasswordModalOpen(true)}
                >
                  <KeyRound size={14} />
                  Change Password
                </button>
              </div>
            </div>

            <SettingsRow label="Full Name" htmlFor="profileFullName">
              <input
                id="profileFullName"
                type="text"
                value={settings.profile.fullName}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, fullName: e.target.value }
                })}
              />
            </SettingsRow>

            <SettingsRow label="Email Address" htmlFor="profileEmail">
              <input
                id="profileEmail"
                type="email"
                value={settings.profile.email}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value }
                })}
              />
            </SettingsRow>

            <SettingsRow label="Phone Number" htmlFor="profilePhone">
              <input
                id="profilePhone"
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, phone: e.target.value }
                })}
              />
            </SettingsRow>

            <SettingsRow label="Active Staff Role" description="Your functional responsibility in the bakery management flow.">
              <select
                aria-label="Active Staff Role"
                value={settings.profile.role}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, role: e.target.value }
                })}
              >
                <option value="Head Baker">Head Baker (Kitchen Master)</option>
                <option value="Owner">Owner / Executive Admin</option>
                <option value="Manager">Bakery Store Manager</option>
                <option value="Cashier">POS Cashier Staff</option>
                <option value="Baker">Baker / Kitchen Assistant</option>
                <option value="Inventory Staff">Inventory & Purchasing Staff</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Bio & Notes" description="Short profile description or specialty area." htmlFor="profileBio" alignTop>
              <textarea
                id="profileBio"
                rows={2}
                value={settings.profile.bio}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, bio: e.target.value }
                })}
              />
            </SettingsRow>
          </SettingsSection>
        )}

        {/* ================= C. ORDERS & PAYMENTS ================= */}
        {(activeTab === 'all' || activeTab === 'orders') && (
          <SettingsSection
            id="orders-payments"
            icon={<CreditCard size={22} />}
            title="Orders & Payments"
            description="Configure tax rates, default billing methods, and automatic order workflows."
            badge="Sales"
            footerActions={
              <button type="button" className="primary-btn small-btn" onClick={() => handleSaveAll()}>
                Save Payment Settings
              </button>
            }
          >
            <SettingsRow label="Tax Rate (PPN)" description="Percentage of government value-added tax applied to order bills." htmlFor="taxRate">
              <div className="input-addon-group">
                <input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.orders.taxRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    orders: { ...settings.orders, taxRate: parseFloat(e.target.value) || 0 }
                  })}
                />
                <span className="input-addon">%</span>
              </div>
            </SettingsRow>

            <SettingsRow label="Service Charge" description="Optional dine-in or packaging service percentage." htmlFor="serviceCharge">
              <div className="input-addon-group">
                <input
                  id="serviceCharge"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={settings.orders.serviceCharge}
                  onChange={(e) => setSettings({
                    ...settings,
                    orders: { ...settings.orders, serviceCharge: parseFloat(e.target.value) || 0 }
                  })}
                />
                <span className="input-addon">%</span>
              </div>
            </SettingsRow>

            <SettingsRow label="Default Payment Method" description="Pre-selected payment channel when creating new cashier orders.">
              <select
                aria-label="Default Payment Method"
                value={settings.orders.defaultPaymentMethod}
                onChange={(e) => setSettings({
                  ...settings,
                  orders: { ...settings.orders, defaultPaymentMethod: e.target.value as any }
                })}
              >
                <option value="Cash">Cash (Tunai)</option>
                <option value="QRIS">QRIS / E-wallet</option>
                <option value="Debit">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Receipt Number Prefix" description="Prefix format for order numbering (e.g. ORD-001)." htmlFor="receiptPrefix">
              <input
                id="receiptPrefix"
                type="text"
                value={settings.orders.receiptPrefix}
                onChange={(e) => setSettings({
                  ...settings,
                  orders: { ...settings.orders, receiptPrefix: e.target.value }
                })}
                placeholder="e.g. ORD"
              />
            </SettingsRow>

            <div className="settings-divider" />

            <div className="settings-toggles-block">
              <SettingsToggle
                id="autoOrderConfirmation"
                label="Automatic Order Confirmation"
                description="Automatically mark online / incoming orders as 'Pending Baking' without manual staff approval."
                checked={settings.orders.autoOrderConfirmation}
                onChange={(val) => setSettings({
                  ...settings,
                  orders: { ...settings.orders, autoOrderConfirmation: val }
                })}
              />

              <SettingsToggle
                id="allowQris"
                label="Enable QRIS Instant Payment"
                description="Allow customers to scan dynamic QRIS codes at checkout."
                checked={settings.orders.allowQrisPayment}
                onChange={(val) => setSettings({
                  ...settings,
                  orders: { ...settings.orders, allowQrisPayment: val }
                })}
              />

              <SettingsToggle
                id="allowBankTransfer"
                label="Enable Bank Transfer Invoicing"
                description="Generate bank account reference numbers for catering and pre-orders."
                checked={settings.orders.allowBankTransfer}
                onChange={(val) => setSettings({
                  ...settings,
                  orders: { ...settings.orders, allowBankTransfer: val }
                })}
              />
            </div>
          </SettingsSection>
        )}

        {/* ================= D. INVENTORY ================= */}
        {(activeTab === 'all' || activeTab === 'inventory') && (
          <SettingsSection
            id="inventory-settings"
            icon={<Package size={22} />}
            title="Inventory Management"
            description="Control low-stock thresholds, ingredient expiration warnings, and automatic deduction rules."
            badge="Kitchen"
            footerActions={
              <button type="button" className="primary-btn small-btn" onClick={() => handleSaveAll()}>
                Save Inventory Settings
              </button>
            }
          >
            <SettingsRow label="Low Stock Threshold" description="Trigger warning when stock of ingredients or finished items falls below this value." htmlFor="lowStockThreshold">
              <div className="input-addon-group">
                <input
                  id="lowStockThreshold"
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.inventory.lowStockThreshold}
                  onChange={(e) => setSettings({
                    ...settings,
                    inventory: { ...settings.inventory, lowStockThreshold: parseInt(e.target.value) || 1 }
                  })}
                />
                <span className="input-addon">units / kg</span>
              </div>
            </SettingsRow>

            <SettingsRow label="Expiration Warning Alert" description="Number of days in advance to notify staff before raw ingredient expiration date." htmlFor="expDays">
              <div className="input-addon-group">
                <input
                  id="expDays"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.inventory.expirationAlertDays}
                  onChange={(e) => setSettings({
                    ...settings,
                    inventory: { ...settings.inventory, expirationAlertDays: parseInt(e.target.value) || 1 }
                  })}
                />
                <span className="input-addon">days before</span>
              </div>
            </SettingsRow>

            <div className="settings-divider" />

            <div className="settings-toggles-block">
              <SettingsToggle
                id="lowStockAlert"
                label="Low Stock Warning Banner"
                description="Show alert badges on Dashboard and Inventory Hub when items reach minimum threshold."
                checked={settings.inventory.lowStockAlert}
                onChange={(val) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, lowStockAlert: val }
                })}
              />

              <SettingsToggle
                id="expirationAlert"
                label="Ingredient Expiry Tracking"
                description="Highlight ingredients nearing expiration in red/yellow within the Ingredients catalog."
                checked={settings.inventory.expirationAlert}
                onChange={(val) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, expirationAlert: val }
                })}
              />

              <SettingsToggle
                id="autoDeduction"
                label="Automatic Recipe Stock Deduction"
                description="Automatically deduct recipe ingredients from raw stock when a batch of baked goods is finished."
                checked={settings.inventory.autoStockDeduction}
                onChange={(val) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, autoStockDeduction: val }
                })}
              />

              <SettingsToggle
                id="wasteTracking"
                label="Waste & Spoilage Log"
                description="Enforce recording reason codes (expired, burnt, dropped) for any manual stock write-offs."
                checked={settings.inventory.wasteTracking}
                onChange={(val) => setSettings({
                  ...settings,
                  inventory: { ...settings.inventory, wasteTracking: val }
                })}
              />
            </div>
          </SettingsSection>
        )}

        {/* ================= E. NOTIFICATIONS ================= */}
        {(activeTab === 'all' || activeTab === 'notifications') && (
          <SettingsSection
            id="notifications-settings"
            icon={<Bell size={22} />}
            title="Notifications & Alerts"
            description="Configure sound and visual notifications for kitchen events, cashier orders, and stock updates."
            badge="Alerts"
            footerActions={
              <button type="button" className="primary-btn small-btn" onClick={() => handleSaveAll()}>
                Save Notification Settings
              </button>
            }
          >
            <div className="settings-toggles-block">
              <SettingsToggle
                id="notifNewOrder"
                label="New Order Notification"
                description="Receive immediate alerts when new customer or dine-in orders are placed."
                checked={settings.notifications.newOrderNotification}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, newOrderNotification: val }
                })}
              />

              <SettingsToggle
                id="notifLowStock"
                label="Low Stock Warning Notification"
                description="Get notified as soon as flour, butter, or packaging supplies drop below safety levels."
                checked={settings.notifications.lowStockNotification}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, lowStockNotification: val }
                })}
              />

              <SettingsToggle
                id="notifExpiring"
                label="Expiring Ingredient Alert"
                description="Receive daily morning reminder for ingredients reaching shelf life this week."
                checked={settings.notifications.expiringIngredientNotification}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, expiringIngredientNotification: val }
                })}
              />

              <SettingsToggle
                id="notifPayment"
                label="Payment Confirmation Alert"
                description="Pop up notification upon successful QRIS, debit, or cash settlement."
                checked={settings.notifications.paymentNotification}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, paymentNotification: val }
                })}
              />

              <SettingsToggle
                id="notifDailySummary"
                label="Daily Sales Closing Summary"
                description="Generate automatic daily summary notification after business closing time."
                checked={settings.notifications.dailySalesSummary}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, dailySalesSummary: val }
                })}
              />

              <SettingsToggle
                id="notifSound"
                label="Audio & Chime Alerts"
                description="Play subtle kitchen chime sound on incoming tickets and priority warnings."
                checked={settings.notifications.soundAlerts}
                onChange={(val) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, soundAlerts: val }
                })}
              />
            </div>
          </SettingsSection>
        )}

        {/* ================= F. SECURITY ================= */}
        {(activeTab === 'all' || activeTab === 'security') && (
          <SettingsSection
            id="security-settings"
            icon={<ShieldCheck size={22} />}
            title="Security & Access"
            description="Manage session protection, authentication policies, and password rotation."
            badge="Security"
            footerActions={
              <button type="button" className="primary-btn small-btn" onClick={() => handleSaveAll()}>
                Save Security Settings
              </button>
            }
          >
            <SettingsRow label="Session Inactivity Timeout" description="Automatically lock the POS / admin panel after inactivity to protect transactions.">
              <select
                aria-label="Session Inactivity Timeout"
                value={settings.security.sessionTimeoutMinutes}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeoutMinutes: parseInt(e.target.value) || 30 }
                })}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={60}>1 Hour</option>
                <option value={240}>4 Hours</option>
                <option value={480}>8 Hours (Full Shift)</option>
              </select>
            </SettingsRow>

            <SettingsRow label="Password Expiry Policy" description="Prompt staff to update security credentials periodically.">
              <select
                aria-label="Password Expiry Policy"
                value={settings.security.requirePasswordChangeDays}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, requirePasswordChangeDays: parseInt(e.target.value) || 90 }
                })}
              >
                <option value={30}>Every 30 Days</option>
                <option value={60}>Every 60 Days</option>
                <option value={90}>Every 90 Days (Default)</option>
                <option value={180}>Every 180 Days</option>
                <option value={0}>Never Expire</option>
              </select>
            </SettingsRow>

            <div className="settings-divider" />

            <div className="settings-toggles-block">
              <SettingsToggle
                id="twoFactorAuth"
                label="Two-Factor Authentication (2FA)"
                description="Require an authenticator PIN / SMS code when signing in from unfamiliar devices."
                checked={settings.security.twoFactorAuth}
                onChange={(val) => setSettings({
                  ...settings,
                  security: { ...settings.security, twoFactorAuth: val }
                })}
              />
            </div>

            <div className="password-action-box">
              <div className="password-action-text">
                <h4 className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                  <KeyRound size={18} color="var(--color-primary)" />
                  Password Management
                </h4>
                <p className="text-muted text-sm">Last changed 24 days ago. Keep your credentials secure.</p>
              </div>
              <button 
                type="button" 
                className="secondary-btn small-btn" 
                onClick={() => setPasswordModalOpen(true)}
              >
                Change Account Password
              </button>
            </div>
          </SettingsSection>
        )}
      </div>

      {/* ================= MODAL: CHANGE PASSWORD ================= */}
      <Modal 
        isOpen={passwordModalOpen} 
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordError('');
        }} 
        title="Change Account Password"
      >
        <form onSubmit={handlePasswordSubmit} className="crud-form">
          <p className="text-muted text-sm mb-3">
            Enter your current password followed by your new secure password.
          </p>

          {passwordError && (
            <div className="modal-alert-error">
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="modal-alert-success">
              <CheckCircle2 size={16} />
              <span>Password updated successfully!</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="currentPass">Current Password *</label>
            <input
              id="currentPass"
              type="password"
              required
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPass">New Password *</label>
            <input
              id="newPass"
              type="password"
              required
              placeholder="Min. 6 characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPass">Confirm New Password *</label>
            <input
              id="confirmPass"
              type="password"
              required
              placeholder="Re-enter new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>

          <div className="form-actions mt-4">
            <button 
              type="button" 
              className="secondary-btn" 
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-btn"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: EDIT PROFILE ================= */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Edit Staff Profile"
      >
        <form onSubmit={handleProfileSubmit} className="crud-form">
          <div className="form-group">
            <label htmlFor="editFullName">Full Name *</label>
            <input
              id="editFullName"
              type="text"
              required
              value={tempProfile.fullName}
              onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editEmail">Email Address *</label>
            <input
              id="editEmail"
              type="email"
              required
              value={tempProfile.email}
              onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editPhone">Phone Number</label>
            <input
              id="editPhone"
              type="tel"
              value={tempProfile.phone}
              onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editRole">Assigned Role</label>
            <select
              id="editRole"
              value={tempProfile.role}
              onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
            >
              <option value="Head Baker">Head Baker</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Baker">Baker</option>
              <option value="Inventory Staff">Inventory Staff</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editBio">Bio / Responsibility</label>
            <textarea
              id="editBio"
              rows={3}
              value={tempProfile.bio}
              onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
            />
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="secondary-btn" onClick={() => setProfileModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
