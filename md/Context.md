# Context

> Aturan data JSON, routing, centralized configuration, dan aturan penting. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian konteks dari index.

---

## Aturan Data JSON

### Prinsip Utama

- **Data shared (dipakai 2+ halaman)** → simpan di `public/data/` atau folder data shared, semua halaman fetch dari sana
- **Data spesifik (hanya dipakai 1 halaman)** → simpan di dalam `src/modules/nama-modul/nama-modul.json`
- **Jangan duplikasi data** — jika dua halaman butuh data yang sama, keduanya fetch dari file yang sama
- **Jangan copy-paste field** dari satu JSON ke JSON lain
- Jika sebuah halaman butuh subset data dari JSON besar, ambil seluruh file lalu filter di JS

### Kapan Membuat JSON Baru

Sebelum membuat file JSON baru, tanya dua pertanyaan:

1. **Apakah data ini dipakai oleh lebih dari satu halaman?** → Ya: simpan di shared data folder. Tidak: simpan di `src/modules/nama/`
2. **Apakah data ini sudah ada di JSON lain?** → Ya: fetch dari JSON yang sudah ada, jangan buat file baru

### Contoh Benar

```js
// Modul dengan data spesifik sendiri
const data = await fetchData('/src/modules/help/help.json');

// Modul yang butuh data shared
const [pageData, sharedData] = await Promise.all([
  fetchData('/src/modules/home/home.json'),
  fetchData('/data/shared.json'),
]);
```

### Contoh Salah

```js
// SALAH — duplikasi field yang sudah ada di shared JSON
// home.json: { "items": [{ "title": "...", "description": "..." }] }
// Jika title & description sudah ada di shared JSON — ambil dari sana

// SALAH — data dipakai dua halaman tapi disimpan di modules/
// src/modules/chat/chat.json ← tidak boleh jika dm juga butuh → pindah ke data shared
```

### Data Map

| File JSON | Dibaca oleh | Jenis | Canonical source |
|---|---|---|---|
| `public/data/` | *(shared data — TBD)* | shared | — |
| `src/modules/home/home.json` | `src/modules/home/home.js` | spesifik | ya |
| `src/modules/profile/profile.json` | `src/modules/profile/profile.js` | spesifik | ya |

> **Catatan:** Data map ini akan bertambah seiring penambahan fitur. Setiap JSON baru harus dicatat di sini.
>
> **Shared data** disimpan di `public/data/`. **Data spesifik satu modul** disimpan di `src/modules/[nama]/[nama].json`.
> Jangan duplikasi data — jika dua fitur butuh field yang sama, fetch dari satu canonical source.

---

## Routing

- Menggunakan **Hash Routing** (`/#/route`) untuk kompatibilitas penuh dengan static hosting
- Router mendengar `hashchange` event — bukan `popstate`
- `navigateTo(path)` dari `src/shared/js/utils/url.js` adalah satu-satunya fungsi yang boleh mengubah URL
- Path selalu ditulis sebagai clean path (`/home`) — hash prefix ditangani oleh `navigateTo()`
- `getHashPath()` mengembalikan path tanpa hash dan tanpa query string (e.g. `/home`)
- `getHashParams()` mengembalikan `URLSearchParams` dari hash query string
- `asset(path)` mengembalikan path absolut dengan `window.BASE` — digunakan untuk `fetch()` ke file statis
- Jangan pernah menulis `window.location.pathname`, `history.pushState()`, atau `window.location.hash` langsung di luar `src/shared/js/utils/url.js`
- Back/forward browser tetap berfungsi karena browser merekam setiap perubahan hash di history stack
- Router melepas `route-change` custom event; layout components mendengarnya untuk sync state
- Modul profil akan dipetakan ke rute `/profile` dan dapat diakses melalui navigasi utama

---

## Centralized Configuration

Semua konstanta environment (storage keys, data paths, limits, timing, dll) didefinisikan di `core/config.js` sebagai **named exports** (`STORAGE_KEYS`, `DATA_PATHS`, `CSS_PATHS`, `LIMITS`, `TIMING`, `MOBILE_BREAKPOINT`, `DEFAULTS`). Import nilai yang dibutuhkan — jangan hardcode apapun di fitur.

```js
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../../core/config.js';
```

### Base Path (GitHub Pages)

- `window.BASE` didefinisikan di `index.html` — environment-aware
- Lokal: `window.BASE = ''` — semua path berfungsi normal
- GitHub Pages: `window.BASE = '/repo-name'` — path di-prefix otomatis
- **Static imports** menggunakan relative path (e.g. `../../js/utils/url.js`)
- **`injectStyle()`** dan **`fetchData()`** — BASE ditambahkan di `src/shared/js/utils/styleLoader.js` dan `src/shared/js/utils/api.js`

---

## Aturan Penting

- Jangan menaruh semua logic di satu file besar
- Jangan mencampur style global dengan style komponen
- Jangan re-render komponen layout (navbar, footer, dll) setiap pindah halaman
- Jangan hardcode konten halaman di JS — selalu baca dari JSON
- Jangan duplikasi data JSON — jika dua halaman butuh data yang sama, keduanya fetch dari file yang sama
- Data shared → shared data folder. Data spesifik satu halaman → `src/modules/nama/nama.json`
- Jaga konsistensi penamaan folder dan file
- Komponen di `src/components/` tidak boleh mengandung logic spesifik halaman
- CSS partial (prefix `_`) hanya di-inject dari file JS fiturnya — tidak standalone
- `src/shared/js/utils/` adalah pure functions — tidak boleh mengimport dari `services/`, `data/`, atau `core/`
