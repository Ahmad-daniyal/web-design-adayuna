# System Design

> Struktur folder aktual, alur eksekusi, dan aturan dependency. Sumber kebenaran tertinggi adalah `CONCLUSION.md` — file ini hanya memisahkan bagian arsitektur dari index.

---

## Struktur Folder

```txt
project-root/
├── index.html                    # Entry point — satu src: <script type="module" src="js/app.js">
├── router.js                     # Router murni — import komponen + halaman, map path → render fn
├── css/
│   └── style.css                 # Semua style (CSS variables untuk light/dark theme)
├── component/                    # Komponen layout (di-render sekali)
│   ├── navbar.js                 # Top navbar + search overlay
│   ├── sidebar.js                # Sidebar navigasi + dark mode toggle
│   ├── footer.js                 # Footer
│   └── auth-modal.js             # Modal login/register
├── page/                         # Halaman — masing-masing export function renderXxx()
│   ├── home.js
│   ├── forum.js
│   ├── friend.js
│   ├── about.js
│   ├── faq.js
│   └── profile.js
├── js/                           # Logic aplikasi (module per fitur)
│   ├── app.js                    # Entry + boot: Router.init() → App.init() → Auth.init()
│   ├── auth.js                   # Auth: session login/logout/register, showToast
│   ├── forum.js                  # Forum: render thread dari ForumData, filter kategori, modal diskusi, vote, komentar
│   ├── friend.js                 # Matching: study buddy filter + render
│   ├── profile.js                # Profile: sync user, journal +5 poin
│   ├── settings.js               # Settings: modal pengaturan, deleteAccount
│   └── data.js                   # Data statis: ForumData, buddies
└── md/                           # Dokumentasi proyek + konteks untuk AI
    ├── CONCLUSION.md             # Ground rules + aturan maks 7 halaman
    ├── Context.md                # Routing, data, auth, aturan penting
    ├── Design.md                 # Aturan CSS & library yang diizinkan
    ├── Plan.md                   # Tata kerja coding, checklist
    ├── System-Design.md          # File ini
    └── SKILLS.md                 # Skill & konvensi tim
```

---

## Alur Eksekusi (Boot)

1. `index.html` memuat `js/app.js` sebagai module tunggal.
2. `js/app.js` mengimport `router.js`, `js/auth.js`, `js/forum.js`, `js/friend.js`, `js/profile.js`, `js/settings.js`, `js/data.js`.
3. `Router.init()` merender slot layout sekali: `#navbar-slot`, `#sidebar-slot`, `#footer-slot`, `#auth-slot`, lalu memanggil `handleRoute()` dan mendengarkan `hashchange`.
4. `App.init()` mengikat semua event global UI (dark mode, search, sidebar, dropdown, ice breaker copy).
5. `Auth.init()` memulihkan sesi dari `localStorage`/`sessionStorage` lalu mengikat event auth.

## Alur Perpindahan Halaman

1. User mengubah `location.hash` (klik link `#/forum`, dsb).
2. `Router.handleRoute()` membaca path, memilih fungsi render dari tabel `routes`, dan mengganti `innerHTML` dari `#app`.
3. Router menandai link aktif, scroll ke atas, lalu melepas event `pageChanged` dengan `{ pageName }` — **dilepas async (microtask)** agar listener yang didaftarkan `App.init()` sudah tersedia saat load pertama (mengatasi halaman forum/friend/profile yang tidak terinisialisasi pada deep-link/reload).
4. `App.initPageHandlers()` mendengarkan `pageChanged` dan memanggil init fitur per halaman: `Forum.refresh()` (forum), `Matching.init()` (friend), `Profile.init()` (profile).
5. Sidebar otomatis tertutup di layar mobile.

## Window Bridge

Karena HTML dirender sebagai string (termasuk atribut `onclick`), objek berikut **wajib** diekspos ke `window` oleh `js/app.js`:

| Objek | Dipakai untuk |
|---|---|
| `window.Auth` | `Auth.openModal('register')`, `Auth.showToast(...)` |
| `window.Settings` | `Settings.openModal()`, `Settings.closeModal()`, `Settings.deleteAccount()` |
| `window.Forum` | `Forum.openNewThread()`, `Forum.toggleVote(this)`, `Forum.submitComment(event)` |
| `window.Matching` | `Matching.requestBuddy(...)`, `Matching.viewProfile(...)` |
| `window.App` | `App.submitContact(event)` (form FAQ) |
| `window.Router` | `Router.navigate('forum')` (klik hasil search) |

## Aturan Dependency

- `page/*.js` dan `component/*.js` **tidak boleh mengimport modul lain** — hanya `export` render function. Interaksi ditangani via event / window bridge.
- `router.js` boleh mengimport dari `component/` dan `page/` (render functions saja).
- `js/app.js` mengimport semua modul `js/*` dan `router.js`.
- `js/*` boleh saling mengimport (mis. `js/forum.js` mengimport `Auth` dari `js/auth.js` dan data dari `js/data.js`).
- `js/data.js` murni data — tidak boleh mengimport dari modul lain.
