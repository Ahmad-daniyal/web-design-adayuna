# Kesimpulan — Refactor Struktur Edquest

## Ringkasan

Edquest adalah SPA Vanilla JS untuk komunitas belajar siswa SMA/SMK. Refactor ini menata ulang seluruh struktur folder mengikuti pola CROWDIT (`CROWDIT2026_Pa-Yoga-Kami-Izin-Lomba-Lagi-Sebelum-PKL`): pemisahan **core / services / utils / data**, komponen per-modul dengan CSS-nya sendiri, fitur per-halaman, dan konten statis dipindah ke **JSON**.

## Keputusan Desain

1. **Render tetap mengembalikan string HTML** (bukan DOM async) — perilaku dan kontrak render dari versi awal dipertahankan, sehingga risiko regresi minimal.
2. **Data statis terpusat di JSON** — `data/forum.json`, `data/buddies.json`, `features/home/home.json`. Semua di-fetch sekali oleh `preloadData()` lalu di-cache di `dataStore` sebelum router merender halaman pertama (fitur membaca dataStore secara sinkron).
3. **CSS terpecah per modul** — `css/global.css` (tema + base) dan satu file per komponen/fitur; dimuat idempotent lewat `injectStyle()` (Set anti-duplikat, `<link>` dinamis).
4. **Konfigurasi terpusat** — storage keys, path data, dan limit disimpan di `js/core/config.js` (tidak ada lagi string literal tersebar).
5. **Window bridge** — `Auth`, `Settings`, `Forum`, `Matching`, `App`, `Router` di-expose ke `window` karena komponen memakai `onclick` inline.
6. **Dokumentasi di root** — `README.md` (konsep & produk), `conclusion.md` (ini), `flow.md` (alur aplikasi); folder `md/` lama dihapus.

## Struktur Akhir

```
adayuna/
├─ index.html                     # entry: css/global.css + js/core/main.js
├─ README.md / conclusion.md / flow.md
├─ css/global.css
├─ js/
│  ├─ core/        main.js, router.js, app.js, config.js, theme.js
│  ├─ services/    auth.js, forum.js, buddy.js, profile.js, settings.js
│  ├─ utils/       styleLoader.js, url.js
│  └─ data/        index.js (dataStore + preloadData)
├─ components/
│  ├─ layout/      navbar/, sidebar/, footer/  (js + css)
│  └─ ui/          auth-modal/ (js + css)
├─ features/
│  ├─ home/        home.js + home.json + css/home.css
│  ├─ forum/       forum.js + css/forum.css
│  ├─ friend/      friend.js + css/friend.css
│  ├─ about/       about.js + css/about.css
│  ├─ faq/         faq.js + css/faq.css
│  └─ profile/     profile.js + css/profile.css
└─ data/           forum.json, buddies.json
```

## Verifikasi

- Graph import dipindai otomatis — semua resolusi valid, tidak ada referensi ke file lama.
- Semua 6 rute (home, forum, friend, about, faq, profile) dirender headless Chromium tanpa console error.
- Tes interaksi via CDP: bridge window ✓, pencarian forum ✓, modal diskusi thread ✓, tutup dengan Escape ✓, registrasi/login + persist ✓, filter Study Buddy ✓, jurnal +5 poin ✓, form kontak ✓, accordion FAQ ✓.

## Catatan / Potensi Pengembangan

- `features/faq/faq.js` mengikat `pageChanged` di module scope — berfungsi, tapi kalau suatu saat modul di-import ulang akan terjadi double-bind (saat ini aman karena import sekali).
- Data mockup di JSON; tahap berikutnya bisa diganti API (cukup ubah `CONFIG.DATA_PATHS` dan `preloadData`).
- `injectStyle` memakai `<link>` dinamis — dianjurkan digabung/minify saat build produksi.
