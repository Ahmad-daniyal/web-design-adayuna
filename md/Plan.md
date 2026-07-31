# Plan

> Cara menambah halaman baru, komponen baru, aturan maks 7 halaman, MD update rule, dan delivery checklist. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian tata kerja dari index.

---

## ⚠️ Aturan Maksimal 7 Halaman

**Jumlah halaman tidak boleh melebihi 7.** Saat ini 6 halaman: Home, Forum, Friend, About, FAQ, Profile.

Sebelum menambah halaman baru, cek dulu:

1. Hitung total halaman (entry di `routes` pada `router.js`).
2. Jika total sudah 7 → **TIDAK BOLEH** menambah halaman. Masukkan fitur ke halaman yang sudah ada.
3. Jika total < 7 → boleh menambah, selama total setelah penambahan ≤ 7.
4. Tambahkan halaman baru ke tabel di `CONCLUSION.md` dan perbarui `System-Design.md`.

---

## 1. Menambah Halaman Baru (Total ≤ 7)

1. Buat `page/<nama>.js`:

   ```js
   export function render<Nama>() { return `<section>...</section>`; }
   ```

2. Daftarkan rute di `router.js`:

   ```js
   import { render<Nama> } from './page/<nama>.js';
   // di tabel routes:
   '<nama>': render<Nama>,
   ```

3. Tambahkan link navigasi di `component/sidebar.js` (dan `component/navbar.js`/`component/footer.js` jika perlu):

   ```html
   <a href="#/<nama>" data-link="<nama>" class="sidebar-link"><i class="fas fa-..."></i><span>Label</span></a>
   ```

4. Jika halaman butuh event saat dibuka (bukan listener sekali-bind), tambahkan pemanggilan di `App.initPageHandlers()` di `js/app.js`:

   ```js
   if (page === '<nama>') <Modul>.init();
   ```

5. **Update `md/`** — daftar halaman di `CONCLUSION.md` dan struktur di `System-Design.md`.

## 2. Menambah Komponen Layout

1. Buat `component/<nama>.js` dengan `export function render<Nama>() { return \`...\`; }`.
2. Render di `Router.init()` (sekali) ke slot yang sesuai.
3. Bind event-nya di `App.init()` di `js/app.js`.

## 3. Menambah Logic Fitur Baru

1. Buat modul di `js/<nama>.js` (IIFE + `export const`), boleh mengimport `Auth`, `Settings`, dan data dari `js/data.js`.
2. Import modul di `js/app.js`, bind listener sekali-bind di sana, dan ekspos ke `window` jika dipakai oleh inline `onclick` (lihat window bridge di `System-Design.md`).
3. Jika memakai data statis baru, masukkan ke `js/data.js`.

---

## MD Update Rule

Setiap response yang membuat halaman baru, komponen, modul, atau perubahan arsitektur HARUS mengupdate bagian yang relevan di `md/`. Jangan deliver perubahan kode tanpa update dokumentasi.

---

## Delivery Checklist

Sebelum mengeluarkan kode, verifikasi:

- [ ] Jumlah halaman ≤ 7 (sesuai aturan di `CONCLUSION.md`)
- [ ] `index.html` hanya memuat satu src: `js/app.js`
- [ ] Router masih murni (hanya map path → render function)
- [ ] Setiap `onclick` inline yang dipakai ada di window bridge (`js/app.js`)
- [ ] Tidak ada hardcoded data yang seharusnya di `js/data.js`
- [ ] Tidak ada nama/avatar/poin user yang hardcode (baca dari `Auth.getUser()`)
- [ ] Tidak ada logic yang di-bind berulang di string HTML (pakai bind-once + `pageChanged`)
- [ ] `md/` diupdate sesuai MD Update Rule
- [ ] Tidak ada framework atau build tool yang diperkenalkan
- [ ] Diuji lewat server lokal (`python3 -m http.server`) — ES Modules tidak jalan via `file://`
