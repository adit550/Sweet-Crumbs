export interface BakeryInfoSettings {
  bakeryName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  businessHoursOpen: string;
  businessHoursClose: string;
  currency: string;
  timezone: string;
}

export interface UserProfileSettings {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  bio: string;
}

export interface OrdersPaymentsSettings {
  taxRate: number;
  defaultPaymentMethod: 'Cash' | 'QRIS' | 'Bank Transfer' | 'Debit';
  autoOrderConfirmation: boolean;
  defaultDiscount: number;
  serviceCharge: number;
  receiptPrefix: string;
  allowCashPayment: boolean;
  allowQrisPayment: boolean;
  allowCardPayment: boolean;
  allowBankTransfer: boolean;
}

export interface InventorySettings {
  lowStockThreshold: number;
  lowStockAlert: boolean;
  expirationAlert: boolean;
  expirationAlertDays: number;
  autoStockDeduction: boolean;
  wasteTracking: boolean;
}

export interface NotificationSettings {
  newOrderNotification: boolean;
  lowStockNotification: boolean;
  expiringIngredientNotification: boolean;
  paymentNotification: boolean;
  dailySalesSummary: boolean;
  soundAlerts: boolean;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  twoFactorAuth: boolean;
  requirePasswordChangeDays: number;
}

export interface AppSettings {
  bakery: BakeryInfoSettings;
  profile: UserProfileSettings;
  orders: OrdersPaymentsSettings;
  inventory: InventorySettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export type SettingsTabId = 'bakery' | 'profile' | 'orders' | 'inventory' | 'notifications' | 'security';
