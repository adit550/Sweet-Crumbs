import type { AppSettings } from '../types/settings';

export const defaultSettings: AppSettings = {
  bakery: {
    bakeryName: 'BakerySys',
    tagline: 'Artisan Bakery & Fresh Pastries',
    address: 'Jl. Kebon Sirih No. 45, Menteng, Jakarta Pusat 10340',
    phone: '+62 812-3456-7890',
    email: 'contact@bakerysys.com',
    businessHoursOpen: '08:00',
    businessHoursClose: '21:00',
    currency: 'IDR (Rp)',
    timezone: 'Asia/Jakarta (WIB - UTC+7)',
  },
  profile: {
    fullName: 'Chef Mario',
    email: 'chef.mario@bakerysys.com',
    phone: '+62 811-2233-4455',
    role: 'Head Baker',
    bio: 'Executive Pastry Chef specializing in sourdoughs, French croissants, and artisanal patisserie with 12+ years of experience.',
  },
  orders: {
    taxRate: 11,
    defaultPaymentMethod: 'Cash',
    autoOrderConfirmation: true,
    defaultDiscount: 0,
    serviceCharge: 0,
    receiptPrefix: 'ORD',
    allowCashPayment: true,
    allowQrisPayment: true,
    allowCardPayment: true,
    allowBankTransfer: true,
  },
  inventory: {
    lowStockThreshold: 10,
    lowStockAlert: true,
    expirationAlert: true,
    expirationAlertDays: 7,
    autoStockDeduction: true,
    wasteTracking: true,
  },
  notifications: {
    newOrderNotification: true,
    lowStockNotification: true,
    expiringIngredientNotification: true,
    paymentNotification: true,
    dailySalesSummary: false,
    soundAlerts: true,
  },
  security: {
    sessionTimeoutMinutes: 30,
    twoFactorAuth: false,
    requirePasswordChangeDays: 90,
  },
};

const SETTINGS_STORAGE_KEY = 'bakerysys_settings_v1';

export const loadStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
      bakery: { ...defaultSettings.bakery, ...parsed.bakery },
      profile: { ...defaultSettings.profile, ...parsed.profile },
      orders: { ...defaultSettings.orders, ...parsed.orders },
      inventory: { ...defaultSettings.inventory, ...parsed.inventory },
      notifications: { ...defaultSettings.notifications, ...parsed.notifications },
      security: { ...defaultSettings.security, ...parsed.security },
    };
  } catch (e) {
    console.warn('Failed to load settings from storage, using defaults:', e);
    return defaultSettings;
  }
};

export const saveStoredSettings = (settings: AppSettings): boolean => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
};
