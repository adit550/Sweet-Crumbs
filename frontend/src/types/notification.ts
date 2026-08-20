export interface BakeryNotification {
  id: string;
  type: 'order' | 'stock' | 'expiry' | 'payment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export const initialNotifications: BakeryNotification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Pesanan Baru Diterima',
    message: 'Pesanan #ORD-005 dari Ethan Hunt (Rp 80.000) sedang menunggu konfirmasi.',
    time: '5 menit lalu',
    read: false,
    link: '/admin/orders',
  },
  {
    id: 'notif-2',
    type: 'stock',
    title: 'Peringatan Stok Menipis',
    message: 'Stok Unsalted Butter tersisa 8 kg (batas minimum: 10 kg). Segera lakukan restock.',
    time: '25 menit lalu',
    read: false,
    link: '/admin/inventory',
  },
  {
    id: 'notif-3',
    type: 'expiry',
    title: 'Bahan Baku Hampir Kadaluarsa',
    message: 'Bahan Vanilla Extract (50 ml) akan kadaluarsa dalam 4 hari.',
    time: '1 jam lalu',
    read: false,
    link: '/admin/ingredients',
  },
  {
    id: 'notif-4',
    type: 'payment',
    title: 'Pembayaran QRIS Berhasil',
    message: 'Pembayaran Rp 90.000 untuk pesanan #ORD-001 telah berhasil diverifikasi.',
    time: '2 jam lalu',
    read: true,
    link: '/admin/transactions',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Laporan Penjualan Harian',
    message: 'Rekap penjualan kemarin telah selesai dibuat: 42 pesanan selesai.',
    time: 'Kemarin',
    read: true,
    link: '/admin/reports',
  },
];

const NOTIF_STORAGE_KEY = 'bakerysys_notifications_v2';

export const loadStoredNotifications = (): BakeryNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!raw) return initialNotifications;
    return JSON.parse(raw);
  } catch (e) {
    return initialNotifications;
  }
};

export const saveStoredNotifications = (notifications: BakeryNotification[]) => {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
};
