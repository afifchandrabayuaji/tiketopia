# Tiketopia 🏔️

Platform jual beli tiket wisata Indonesia berdasarkan kategori provinsi. Dibuat dengan Express + EJS + PostgreSQL (Sequelize) + Nodemailer.

## ✨ Fitur

- **Auth**: Register & login user, session-based, role `user` / `admin`.
- **CREATE**: Admin menambahkan destinasi wisata baru (nama, lokasi, ketinggian, narasi sejarah, flora, fauna, fakta unik, tiket).
- **READ**: Beranda menampilkan destinasi populer & kategori provinsi. Klik kartu destinasi → jika belum login diarahkan ke halaman login/register, jika sudah login masuk ke halaman detail.
- **UPDATE**: Admin memperbarui info destinasi (mis. menambahkan flora/fauna baru). User mengedit komentar miliknya sendiri.
- **DELETE**: User menghapus komentar miliknya sendiri. Admin menghapus komentar siapa pun (moderasi) dan menghapus destinasi.
- **Beli tiket**: User checkout tiket (simulasi potong saldo dompet, bukan payment gateway asli) → otomatis dikirim email berisi e-tiket via Nodemailer.
- **Ulasan**: User yang sudah membeli tiket ke suatu destinasi bisa memberi ulasan (rating + komentar) di destinasi tersebut.

## ⚠️ Penyesuaian dari ERD yang Anda kirim

ERD awal Anda memiliki 5 tabel: `User`, `Province`, `Destination`, `Ticket`, `Transaction`. Beberapa penyesuaian saya lakukan supaya semua fitur yang diminta bisa berjalan:

1. **Tabel `Comment` (baru)** — tidak ada di ERD awal, tapi dibutuhkan untuk fitur ulasan. Relasi: `User` 1—N `Comment`, `Destination` 1—N `Comment`.
2. **Kolom tambahan di `Destination`**: `location`, `altitude`, `openHours`, `history`, `flora[]`, `fauna[]`, `uniqueFacts` — karena field ini disebut di requirement (narasi sejarah, flora/fauna, fakta unik) tapi belum ada di ERD Anda (yang hanya punya `name`, `description`, `provinceId`, `image`).
3. **Kolom tambahan di `Transaction`**: `quantityAdult`, `quantityChild` — untuk mendukung form pembelian dengan jumlah tiket dewasa/anak seperti di mockup Anda.
4. **Relasi Province ↔ Destination**: pada gambar ERD, panah FK digambar dari kedua arah (`Province.DestinationId` dan `Destination.ProvinceId`), yang secara model data itu redundan/sirkular. Saya implementasikan sebagai relasi standar: **1 Province punya banyak Destination** (`Destination.provinceId` sebagai FK), karena ini yang paling masuk akal secara bisnis (satu destinasi berada di satu provinsi).

Jika Anda ingin skema persis 1:1 dengan ERD asli (tanpa kolom tambahan di atas), beri tahu saya dan saya sesuaikan — tapi beberapa fitur (narasi sejarah, flora/fauna, fakta unik, ulasan) tidak akan bisa berjalan tanpa kolom/tabel tersebut.

## 🗂️ Struktur Folder

```
tiketopia/
├── src/
│   ├── config/       # koneksi database & nodemailer
│   ├── models/        # model Sequelize + relasi
│   ├── middlewares/  # auth guard (isLoggedIn, isAdmin)
│   ├── controllers/  # logic tiap fitur
│   ├── routes/        # routing Express
│   ├── views/         # EJS templates
│   ├── public/        # CSS statis
│   └── app.js          # entry point
├── seed/
│   └── seed.js         # data awal (admin, user, provinsi, destinasi contoh)
├── package.json
└── .env.example
```

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan database PostgreSQL

Buat database baru:

```sql
CREATE DATABASE tiketopia;
```

### 3. Konfigurasi environment

Salin `.env.example` menjadi `.env`, lalu sesuaikan:

```bash
cp .env.example .env
```

Isi kredensial database Anda dan kredensial SMTP untuk Nodemailer. Jika pakai Gmail, gunakan **App Password** (bukan password akun biasa) — aktifkan di [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

### 4. Jalankan seed data (opsional, untuk data contoh)

```bash
npm run seed
```

Ini akan membuat:
- Admin: `admin@tiketopia.com` / `admin123`
- User: `andi@example.com` / `user123`
- 4 destinasi contoh (Kawah Putih, Gunung Bromo, Pantai Kelingking, Candi Borobudur) beserta tiketnya.

> ⚠️ `npm run seed` akan **menghapus semua data** yang ada (`force: true`) dan membuat ulang tabel. Jangan jalankan di database produksi yang sudah berisi data penting.

### 5. Jalankan server

```bash
npm run dev   # dengan auto-reload (nodemon)
# atau
npm start
```

Buka [http://localhost:3000](http://localhost:3000).

## 🔑 Alur Penting

- **Beli tiket**: sistem mengecek `balance` user cukup atau tidak, lalu memotong saldo dan membuat `Transaction` berstatus `paid`, kemudian mengirim email via Nodemailer berisi detail tiket. Jika pengiriman email gagal, transaksi tetap tersimpan (tidak di-rollback) — hanya dicatat di console log server.
- **Komentar**: hanya user yang punya `Transaction` berstatus `paid` untuk tiket ke destinasi tersebut yang bisa menulis ulasan.
- **Akun admin**: sengaja tidak ada form registrasi untuk admin (sesuai requirement — admin sudah punya akun khusus). Buat admin baru langsung lewat database atau tambahkan manual di `seed/seed.js`.

## 🛠️ Pengembangan Selanjutnya (Saran)

- Tambahkan upload gambar via `multer` (saat ini gambar hanya berupa URL string).
- Ganti `sequelize.sync()` dengan migration (`sequelize-cli`) untuk lingkungan produksi.
- Tambahkan validasi input lebih ketat (mis. dengan `express-validator`).
- Tambahkan pagination di halaman daftar destinasi & kelola komentar admin.
