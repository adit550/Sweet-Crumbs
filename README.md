# Bakery Management Dashboard

Sistem manajemen toko roti (L'Atelier Bakery) untuk mengatur inventaris, pesanan, daftar pelanggan, serta memberikan akses frontend kepada pelanggan untuk melakukan pemesanan (checkout).

## Tech Stack

- **Frontend:** React + TypeScript (menggunakan Vite)
- **Backend:** Bun + Elysia.js
- **Database:** PostgreSQL
- **ORM:** Prisma

---

## Prerequisites

Untuk menjalankan proyek ini di lingkungan lokal Anda, pastikan telah ter-install:

- [Bun](https://bun.sh/) (sebagai *runtime* & *package manager* backend)
- [Node.js](https://nodejs.org/) / npm (untuk frontend)
- [PostgreSQL](https://www.postgresql.org/) (server database lokal)
- Git

---

## Installation / Setup

1. **Clone repositori**
   ```bash
   git clone <repository_url>
   cd "Bakery Management System"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   bun install
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

---

## Environment Variables

Proyek menggunakan *environment variables* untuk keamanan. Di dalam folder `backend/`, buat file `.env`.

**Jangan commit file `.env` yang berisi kredensial asli!**

Contoh `.env` untuk backend:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_key"
```

---

## PostgreSQL Setup

1. Pastikan server PostgreSQL telah aktif.
2. Buat satu database kosong untuk proyek ini (misalnya `bakery_db`).
3. Sesuaikan `DATABASE_URL` pada file `backend/.env` dengan kredensial PostgreSQL Anda.

---

## Prisma Setup

Proyek ini telah dikonfigurasi penuh dengan Prisma (`backend/prisma/schema.prisma`).

Setelah mengonfigurasi `.env`, sinkronisasi skema Prisma ke database dengan menjalankan perintah berikut di dalam folder `backend/`:

```bash
# Untuk sinkronisasi awal dan pembuatan tabel (push schema ke database)
bunx prisma db push

# Untuk generate Prisma Client
bunx prisma generate
```

*Catatan: Proyek ini menggunakan `db push` untuk sinkronisasi. Jangan gunakan `prisma migrate reset` di lingkungan produksi atau jika tidak disengaja ingin menghapus semua data!*

---

## Running the Application

Jalankan aplikasi dengan dua terminal terpisah:

### Terminal 1 → Backend
```bash
cd backend
bun run dev
```
API akan berjalan (secara *default* di `http://localhost:3001`).

### Terminal 2 → Frontend
```bash
cd frontend
npm run dev
```
Aplikasi web dapat diakses (secara *default* di `http://localhost:5173`).

---

## Project Structure

```text
Bakery Management System/
├── backend/
│   ├── prisma/             # Schema & Prisma Config
│   ├── .env                # Variabel Lingkungan
│   ├── index.ts            # Entry point Elysia & Endpoint API
│   └── package.json        # Dependensi backend
├── frontend/
│   ├── src/                # Kode React (Components, Pages, dsb.)
│   └── package.json        # Dependensi frontend
└── README.md
```

---

## API Documentation

Endpoint berjalan pada server backend.

### Authentication

API menggunakan JWT authentication yang didapat melalui endpoint login.

#### Login
```http
POST /login
```
**Request Body:**
```json
{
  "email": "admin1@gmail.com",
  "password": "your_password"
}
```
**Success Response:**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": "...",
    "email": "...",
    "role": "..."
  }
}
```

*Endpoint yang diamankan belum diterapkan ketat di rute pesanan, namun fitur `/me` membutuhkan Bearer token:*
```http
Authorization: Bearer <token>
```

---

## CRUD API (Orders & Merchandise)

Operasi manajemen toko benar-benar tersimpan ke PostgreSQL melalui Prisma.

### 1. Dapatkan Daftar Order (READ)
```http
GET /api/orders
```
**Success Response (200):**
Mengembalikan array objek order (termasuk list item yang menempel).

### 2. Buat Order Baru (CREATE)
```http
POST /api/orders
```
**Request Body:**
```json
{
  "customerName": "John Doe",
  "date": "2023-10-25 10:30",
  "totalAmount": 110000,
  "items": [
    {
      "productId": "p1",
      "productName": "Butter Croissant",
      "quantity": 2,
      "unitPrice": 35000
    }
  ]
}
```

### 3. Ubah Status Order (UPDATE)
```http
PUT /api/orders/:id/status
```
**Request Body:**
```json
{
  "status": "Ready"
}
```

### 4. Hapus Order (DELETE)
```http
DELETE /api/orders/:id
```
**Success Response (200):** Menghapus baris secara persisten.

### 5. Dapatkan Daftar Produk
```http
GET /api/merch
```
**Success Response (200):** Mengembalikan inventaris produk toko roti.

---

## Error Handling

Standard HTTP Response digunakan:
- `200` / `201`: Sukses.
- `400`: Bad Request (Bentuk validasi error seperti kehilangan data wajib).
- `401`: Unauthorized (Gagal login, token tidak valid).
- `404`: Not Found.
- `500`: Internal Server Error (Kendala di tingkat PostgreSQL/Prisma).

---

## Frontend

- Dibangun menggunakan **React**, dikemas lewat **Vite**.
- Sistem perutean (**react-router-dom**) memisahkan area:
  - `/admin/*` untuk *Dashboard*, *Order Management*, *Inventory*.
  - *Route Dasar* (`/`, `/menu`, `/cart`, `/checkout`) untuk tampilan interaktif pelanggan.
- Autentikasi diselubungi Context API (`AuthContext`) yang menjembatani JWT.

---

## Backend

- Menggunakan **Elysia.js** (berbasis Bun) untuk menjamin operasi ekstra cepat.
- **Prisma ORM** menyambungkan rute *endpoint* langsung ke PostgreSQL.
- Data disajikan dengan skema bertipe statis untuk kesesuaian lintas lapisan (*type-safety*).

---

## Troubleshooting

### Database Connection Error
Jika saat menjalankan backend muncul error koneksi Prisma:
- Pastikan layanan *PostgreSQL* lokal/remote di PC Anda sudah berjalan.
- Buka file `backend/.env` dan pastikan kredensial `DATABASE_URL` (terutama kata sandi dan nama database) benar.
- Coba validasi konfigurasi dengan menjalankan: `bunx prisma validate` di folder backend.

### API Connection Error
- Pastikan Terminal Backend tetap aktif saat Anda menjalankan *Frontend*.
- Periksa port pada *backend*. Jika tidak sama dengan port referensi pada frontend, sesuaikan pengaturan `fetch()` atau `Cors`.

---

## Testing

### Unit Testing

Testing menggunakan Bun Test. Unit Test difokuskan untuk menguji logika bisnis tanpa bergantung pada database production.

Run:
```bash
cd backend
bun test
```

Test yang telah dibuat dan dijalankan:
- **Product validation**: Menguji validasi input (nama, harga, stok) saat membuat produk baru.
- **Order calculation**: Menguji fungsi kalkulasi order (subtotal, biaya pengiriman, total).
- **Authentication validation**: Menguji validasi login dan registrasi (email valid, format password).

### Validasi Build
```bash
cd frontend
bun run lint
bun run build
```

```bash
cd backend
bunx prisma validate
```
