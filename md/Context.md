# Context

> Aturan routing, data, auth/session, dan aturan penting. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian konteks dari index.

---

## Aturan Jumlah Halaman

- **Jumlah halaman tidak boleh melebihi 7** (lihat `CONCLUSION.md`).
- Halaman aktif: Home, Forum, Friend, About, FAQ, Profile (6 halaman).
- Fitur baru masuk ke halaman yang sudah ada; jangan menambah halaman jika total akan melebihi 7.

---

## Routing

- Menggunakan **Hash Routing** (`#/forum`) untuk kompatibilitas penuh dengan static hosting.
- Router mendengar `hashchange` — bukan `popstate`.
- `router.js` punya tabel `routes` = map `path → fungsi render` (bukan string nama fungsi). Path tanpa prefix slash (`forum`), `'/'` dan `'home'` sama-sama menuju `renderHome`.
- **Satu-satunya cara mengubah halaman:** set `window.location.hash` atau klik link `<a href="#/forum">`. Jangan memanggil render function secara langsung di luar `router.js`.
- Router melepas custom event `pageChanged` (`{ detail: { pageName } }`) setelah konten dirender.
- `Router.navigate(page)` tersedia untuk navigasi dari JS (dipakai di hasil pencarian).

## Render Function Contract

Setiap halaman dan komponen layout mengekspor fungsi yang mengembalikan string HTML:

```js
export function renderHome() { return `<section>...</section>`; }
```

- Halaman dirender ke `#app` setiap kali hash berubah — event/state yang hidup lintas kunjungan harus di-bind sekali (di `App.init()` atau via `pageChanged`), bukan di dalam string HTML.
- Komponen layout (navbar, sidebar, footer, auth modal) dirender **sekali** oleh `Router.init()` — jangan render ulang setiap pindah halaman.

## Data

- **Data statis** dipusatkan di `js/data.js` dengan named exports: `ForumData` (thread forum) dan `buddies` (daftar study buddy).
- Modul fitur mengimport data dari `js/data.js` — jangan hardcode data di `page/*.js` atau `js/*.js`.
- Data yang sifatnya spesifik user (nama, poin, journal) disimpan di objek user di `localStorage`/`sessionStorage` — bukan di file data.
- Jangan duplikasi data antar file.

## Auth & Session

- Sesi disimpan di `localStorage` (key `edquest_user`) jika "Ingat saya", atau `sessionStorage` bila tidak.
- `Auth.init()` membaca dari keduanya saat boot.
- `Auth.clearSession()` menghapus user dari kedua storage **dan** mereset UI navbar — wajib dipakai untuk logout dan `Settings.deleteAccount()`.
- `Auth.getUser()` mengembalikan objek user aktif atau `null`; `Auth.isLoggedIn()` cek status login.
- Halaman profil harus membaca data dari `Auth.getUser()`, bukan hardcode nama/avatar/poin.

## Tema (Dark Mode)

- Kunci `edquest_dark` di `localStorage`; pre-hydration script di `<head>` `index.html` menerapkan class `dark` sebelum paint.
- Ada **dua toggle**: `#darkModeToggle` (navbar) dan `#sidebarDarkToggle` (sidebar). Keduanya di-bind oleh `App.initDarkMode()` dan harus sinkron.
- Semua warna memakai CSS variables (`var(--bg-body)`, `var(--text-primary)`, dll.) atau utility Tailwind `dark:` — jangan hardcode warna yang tidak adaptif.

## Aturan Penting

- Jangan menaruh semua logic di satu file besar; satu file = satu tanggung jawab.
- Jangan re-render komponen layout (navbar, footer, dll.) setiap pindah halaman.
- Jangan hardcode konten halaman yang seharusnya dari `js/data.js`.
- Jangan hapus atau mengganti aturan "maksimal 7 halaman" tanpa instruksi eksplisit dari manusia.
- Setiap perubahan arsitektur wajib diupdate di `md/` (lihat `Plan.md` → MD Update Rule).
- ES Modules tidak jalan lewat `file://` — uji lewat server lokal (`python3 -m http.server`).
