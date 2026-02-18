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

3.  Salin file `.env.example` ke `.env` dan isi dengan konfigurasi Firebase Anda:

    ```bash
    cp .env.example .env
    ```

    Format `.env`:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
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
