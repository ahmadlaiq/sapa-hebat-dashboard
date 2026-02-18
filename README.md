# Sapa Hebat Dashboard

Dashboard CRUD lengkap menggunakan SvelteKit, Tailwind CSS, dan Firebase Firestore.

## Struktur Proyek

- **`src/lib/firebase.js`**: Konfigurasi Firebase dan inisialisasi Firestore.
- **`src/lib/stores.js`**: Store Svelte reaktif yang menggunakan `onSnapshot` untuk sinkronisasi data real-time.
- **`src/routes/+layout.svelte`**: Layout utama dengan sidebar navigasi.
- **`src/routes/guru/+page.svelte`**: Halaman CRUD untuk data Guru.
- **`src/routes/ortu/+page.svelte`**: Halaman CRUD untuk data Orang Tua.
- **`src/routes/siswa/+page.svelte`**: Halaman CRUD untuk data Siswa dengan relasi ke Guru dan Ortu via dropdown.

## Kompatibilitas Node.js

Proyek ini telah disesuaikan unuk Node.js v24 (v18+). Pastikan versi Node.js Anda `>=18.0.0`.

## Persiapan

1.  Masuk ke direktori proyek:

    ```bash
    cd admin-dashboard
    ```

2.  Instal dependensi (gunakan `--legacy-peer-deps` jika ada konflik):

    ```bash
    npm install --legacy-peer-deps
    ```

3.  Buat file `.env` di root direktori (sudah ada):
    ```env
    VITE_FIREBASE_API_KEY=AIzaSyCP9h4JIdeh2KnWnLPn9VXqqfAqNXFNPGY
    VITE_FIREBASE_AUTH_DOMAIN=sapa-hebat.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=sapa-hebat
    VITE_FIREBASE_STORAGE_BUCKET=sapa-hebat.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=273103032055
    VITE_FIREBASE_APP_ID=1:273103032055:web:98555d16b8a83b4e508df2
    VITE_FIREBASE_MEASUREMENT_ID=G-JW1J44T9VV
    ```

## Menjalankan Aplikasi

Untuk menjalankan server pengembangan:

```bash
npm run dev
```

Buka browser di `http://localhost:5173`.

## Membangun untuk Produksi (Netlify)

Proyek ini menggunakan konfigurasi standar SvelteKit. Untuk deploy ke Netlify:

```bash
npm run build
```

Jika build gagal karena masalah dependensi, coba hapus `node_modules` dan `package-lock.json` lalu jalankan `npm install` kembali.
