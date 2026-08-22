# Sweet Crumbs (Bakery Management System)

Sistem manajemen toko roti (Sweet Crumbs / L'Atelier Bakery) untuk mengatur inventaris, pesanan, daftar pelanggan, serta memberikan akses frontend kepada pelanggan untuk melakukan pemesanan (checkout) melalui Dashboard. Aplikasi ini mencakup fungsionalitas CRUD penuh untuk manajemen produk (merchandise) dan pesanan (orders).

## Tech Stack

- **Backend**: Bun, Elysia.js, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Bun Test

---

## Requirements

Untuk menjalankan proyek ini, pastikan Anda telah menginstal perangkat lunak berikut:

- [Bun](https://bun.sh/) (Runtime & Package Manager)
- [Node.js](https://nodejs.org/) (Opsi alternatif untuk frontend, Vite membutuhkan Node env)
- [PostgreSQL](https://www.postgresql.org/) (Server Database)
- Git
- Web Browser Modern (Chrome, Firefox, dll.)

---

## Project Structure

```text
Sweet-Crumbs/
├── backend/
│   ├── prisma/             # Schema & konfigurasi Prisma
│   ├── tests/              # Unit & Integration Tests (Bun Test)
│   ├── index.ts            # Entry point backend & Routes API
│   ├── package.json
│   └── .env                # (Dibuat manual)
├── frontend/
│   ├── public/
│   ├── src/                # Komponen React & Pages
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Database Setup

1. Pastikan server PostgreSQL telah berjalan di komputer Anda.
2. Buat database baru (contoh: `bakery_db`).
3. Konfigurasi kredensial akses pada file `.env` (lihat bagian Backend Setup).
4. Proyek ini menggunakan Prisma ORM. Sinkronisasi tabel dilakukan melalui perintah `bunx prisma db push` (jangan gunakan `migrate reset` kecuali secara eksplisit diperlukan).

---

## Backend Setup

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   bun install
   ```

2. Buat file `.env` di dalam folder `backend` berdasarkan konfigurasi PostgreSQL Anda. **Jangan masukkan credential asli ke repository.**
   Contoh konfigurasi `.env`:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE
   JWT_SECRET=your_secret_key_here
   ```

3. Generate Prisma Client dan sinkronisasi skema database:
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```
   *(Catatan: Anda juga bisa menjalankan `bun run db:push` / `bun run db:generate`)*

4. Jalankan server backend:
   ```bash
   bun run dev
   ```
   Backend akan berjalan di `http://localhost:3001`.

---

## Frontend Setup

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   bun install
   ```
   *(Atau gunakan `npm install` jika menggunakan npm)*

2. Jalankan development server untuk frontend:
   ```bash
   bun run dev
   ```
   *(Atau `npm run dev`)*
   
   Frontend dapat diakses di `http://localhost:5173`.

---

## API Authentication

API menggunakan **JWT (JSON Web Token)** untuk endpoint yang dilindungi (Admin/Customer). 

- **Cara mendapatkan token**: Lakukan request POST ke `/api/auth/login`. Token akan dikembalikan pada atribut `token`.
- **Cara mengirim token**: Sisipkan token pada header `Authorization` dengan format:
  ```http
  Authorization: Bearer YOUR_TOKEN
  ```
- **Role/Permission**: Pengguna memiliki role `CUSTOMER` atau `ADMIN`. Beberapa endpoint seperti Update/Delete Order memerlukan role `ADMIN`.

---

## API Documentation

Endpoint base URL: `http://localhost:3001`

### 1. System

#### GET `/api/health`
**Description:** Memeriksa status kesehatan server.
**Authentication:** Public
**Response Success (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2023-10-25T10:00:00.000Z"
}
```

### 2. Authentication

#### POST `/api/auth/register`
**Description:** Mendaftarkan pengguna baru.
**Authentication:** Public
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "08123456789",
  "role": "CUSTOMER"
}
```
**Response Success (200 OK):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```
**Error Response (400 Bad Request):** Email sudah digunakan.

#### POST `/api/auth/login`
**Description:** Autentikasi pengguna dan mendapatkan JWT token.
**Authentication:** Public
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response Success (200 OK):**
```json
{
  "message": "Login successful",
  "token": "YOUR_TOKEN",
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```
**Error Response (401 Unauthorized):** Invalid email or password.

#### GET `/api/auth/me`
**Description:** Mendapatkan profil pengguna yang sedang login.
**Authentication:** Required (Bearer Token)
**Response Success (200 OK):**
```json
{
  "id": "cuid...",
  "email": "user@example.com",
  "role": "CUSTOMER"
}
```
**Error Response (401 Unauthorized):** Token tidak valid atau tidak disertakan.

### 3. Merchandise (Products)

#### GET `/api/merch`
**Description:** Mendapatkan daftar semua merchandise/produk (mendukung query `search`, `category`, `status`).
**Authentication:** Public
**Response Success (200 OK):**
```json
[
  {
    "id": "cuid...",
    "name": "Butter Croissant",
    "category": "Pastry",
    "price": 25000,
    "stock": 50,
    "description": "Flaky, buttery perfection.",
    "imageUrl": "/products/butter_croissant.jpg",
    "status": "ACTIVE",
    "createdAt": "2023-10-25T10:00:00.000Z",
    "updatedAt": "2023-10-25T10:00:00.000Z"
  }
]
```

#### GET `/api/merch/:id`
**Description:** Mendapatkan detail satu produk berdasarkan ID.
**Authentication:** Public
**Status Code:** `200 OK` atau `404 Not Found`.

#### POST `/api/merch`
**Description:** Menambahkan produk baru.
**Authentication:** Required
**Request Body:**
```json
{
  "name": "New Pastry",
  "category": "Pastry",
  "price": 30000,
  "stock": 10,
  "description": "A new delicious pastry.",
  "status": "ACTIVE"
}
```
**Response Success (201 Created):** Objek produk yang baru dibuat.

#### PUT `/api/merch/:id`
**Description:** Mengubah data produk yang ada.
**Authentication:** Required
**Request Body:** (Semua field opsional)
```json
{
  "price": 35000,
  "stock": 15
}
```
**Response Success (200 OK):** Objek produk yang telah diperbarui.
**Error Response:** `404 Not Found`.

#### DELETE `/api/merch/:id`
**Description:** Menghapus produk.
**Authentication:** Required
**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Merchandise deleted successfully"
}
```

#### POST `/api/merch/seed`
**Description:** Mengisi database dengan data demo produk (akan menghapus produk sebelumnya).
**Authentication:** Public
**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Successfully seeded 27 demo merchandise items!"
}
```

### 4. Orders

#### GET `/api/orders`
**Description:** Mendapatkan daftar pesanan. Admin melihat semua pesanan, Customer hanya melihat pesanan miliknya.
**Authentication:** Required
**Response Success (200 OK):**
```json
[
  {
    "id": "cuid...",
    "customerName": "user@example.com",
    "date": "2023-10-25 10:30",
    "totalAmount": 70000,
    "status": "Pending",
    "createdAt": "...",
    "items": [
      {
        "id": "cuid...",
        "productId": "cuid...",
        "productName": "Butter Croissant",
        "quantity": 2,
        "unitPrice": 35000
      }
    ]
  }
]
```

#### POST `/api/orders`
**Description:** Membuat pesanan baru.
**Authentication:** Required
**Request Body:**
```json
{
  "customerName": "user@example.com",
  "date": "2023-10-25 10:30",
  "totalAmount": 70000,
  "items": [
    {
      "productId": "cuid...",
      "productName": "Butter Croissant",
      "quantity": 2,
      "unitPrice": 35000
    }
  ]
}
```
**Response Success (201 Created):** Objek pesanan yang baru dibuat.

#### PUT `/api/orders/:id/status`
**Description:** Mengubah status pesanan.
**Authentication:** Required (Admin Only)
**Request Body:**
```json
{
  "status": "Ready"
}
```
**Response Success (200 OK):** Objek pesanan yang telah diperbarui.

#### DELETE `/api/orders/:id`
**Description:** Menghapus pesanan.
**Authentication:** Required (Admin Only)
**Response Success (200 OK):**
```json
{
  "success": true
}
```

---

## Testing

Proyek ini dilengkapi dengan Unit Test dan Integration Test menggunakan `bun:test`. 
Integration test menguji jalur end-to-end dari `Elysia.js → Prisma → PostgreSQL Test Database`.

Untuk menjalankan tes:
```bash
cd backend
bun test
```

*Catatan: Pastikan database testing sudah dikonfigurasi melalui `.env.test` sebelum menjalankan integration tests.*

### Test Coverage

Berdasarkan eksekusi pengujian terakhir:

```text
Unit Test:
Passed: 27
Failed: 0

Integration Test:
Passed: 19
Failed: 0
```

---

## Build & Production

Untuk melakukan build pada proyek frontend:

```bash
cd frontend
bun run build
```
*(Atau `npm run build`)*

Hasil build statis akan tersedia di dalam folder `frontend/dist`.
*(Saat ini belum ada konfigurasi deployment/production khusus untuk backend pada repository).*

---

## Troubleshooting

- **PostgreSQL tidak berjalan**: Pastikan service PostgreSQL sudah berjalan di sistem/background OS Anda (via services.msc di Windows atau `brew services start postgresql` di Mac).
- **DATABASE_URL salah / Error P1001**: Periksa kembali format URL di `.env`, pastikan username, password, port (umumnya 5432), dan nama database valid.
- **Prisma client belum di-generate**: Jalankan `bunx prisma generate` di folder `backend`. Muncul error "PrismaClient is not defined" jika langkah ini dilewati.
- **Port backend/frontend sudah digunakan**: Pastikan tidak ada aplikasi lain yang menggunakan port `3001` (Backend) dan `5173` (Frontend). Anda dapat mematikan proses node/bun di Task Manager atau merestart terminal.

---

## Final Checklist

```text
[x] Project overview
[x] Tech stack
[x] Requirements
[x] Project structure
[x] Backend setup
[x] Frontend setup
[x] PostgreSQL setup
[x] Prisma setup
[x] Environment variables
[x] API documentation
[x] Authentication documentation
[x] Request examples
[x] Response examples
[x] HTTP status codes
[x] Unit testing
[x] Integration testing
[x] Build instructions
[x] Troubleshooting
```
